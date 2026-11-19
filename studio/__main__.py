import argparse
import ast
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

from aiohttp import web

from studio.app import create_app
from studio.runner import infer_checkpoint_family

STUDIO_DIR = Path(__file__).resolve().parent
ROOT_DIR = STUDIO_DIR.parent


def probe_gpu_environment():
    info = {
        "nvidiaSmiFound": False,
        "hardwareGpuName": "",
        "hardwareVramMB": 0.0,
        "torchInstalled": False,
        "torchVersion": "",
        "torchCudaAvailable": False,
        "torchCudaVersion": "",
        "torchGpuName": "",
        "torchVramMB": 0.0,
    }
    try:
        res = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        )
        if res.returncode == 0 and res.stdout.strip():
            first_line = res.stdout.strip().splitlines()[0]
            parts = [p.strip() for p in first_line.split(",")]
            info["nvidiaSmiFound"] = True
            info["hardwareGpuName"] = parts[0] if parts else ""
            info["hardwareVramMB"] = float(parts[1]) if len(parts) > 1 else 0.0
    except Exception:
        pass
    try:
        import torch

        info["torchInstalled"] = True
        info["torchVersion"] = str(getattr(torch, "__version__", ""))
        info["torchCudaVersion"] = str(getattr(torch.version, "cuda", None) or "")
        info["torchCudaAvailable"] = bool(torch.cuda.is_available())
        if info["torchCudaAvailable"]:
            info["torchGpuName"] = str(torch.cuda.get_device_name(0) or "")
            props = torch.cuda.get_device_properties(0)
            info["torchVramMB"] = float(getattr(props, "total_memory", 0)) / (1024.0 * 1024.0)
    except Exception:
        pass
    return info


def is_port_listening(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.3)
        return sock.connect_ex((host, port)) == 0


def parse_local_comfy_target(comfy_url):
    try:
        parsed = urlparse(str(comfy_url or ""))
        host = (parsed.hostname or "").strip().lower()
        port = parsed.port or (443 if parsed.scheme == "https" else 8188)
        if host in ("127.0.0.1", "localhost", "0.0.0.0"):
            return ("127.0.0.1" if host == "0.0.0.0" else host, int(port))
    except Exception:
        pass
    return None


def detect_comfy_worker_flags():
    flags = ["--disable-auto-launch"]
    env = probe_gpu_environment()
    if not env["torchCudaAvailable"]:
        if env["hardwareVramMB"] > 0:
            print(
                f"[Studio] CẢNH BÁO: Máy có GPU NVIDIA ({env['hardwareGpuName']}, {int(env['hardwareVramMB'])} MB VRAM) "
                f"nhưng PyTorch đang là bản CPU ({env['torchVersion'] or 'unknown'}). ComfyUI tạm chạy --cpu. "
                "Chạy '.\\studio doctor' để xem lệnh cài PyTorch CUDA!",
                file=sys.stderr,
            )
        flags.append("--cpu")
        return flags

    vram_mb = env["torchVramMB"] or env["hardwareVramMB"]
    gpu_name = (env["torchGpuName"] or env["hardwareGpuName"] or "").lower()
    if vram_mb <= 6500 or "1650" in gpu_name or "1660" in gpu_name:
        flags.extend(["--lowvram", "--fp32-vae", "--force-upcast-attention"])
    return flags


def start_comfy_worker_if_needed(comfy_url):
    if os.environ.get("STUDIO_DISABLE_AUTO_WORKER") == "1":
        return None
    target = parse_local_comfy_target(comfy_url)
    main_py = ROOT_DIR / "main.py"
    if target is None or not main_py.is_file():
        return None
    host, port = target
    if is_port_listening(host, port):
        return None
    worker_cmd = [
        sys.executable,
        str(main_py),
        "--listen",
        host,
        "--port",
        str(port),
        *detect_comfy_worker_flags(),
    ]
    return subprocess.Popen(worker_cmd, cwd=str(ROOT_DIR))


def terminate_process(proc):
    if proc is None or proc.poll() is not None:
        return
    if os.name == "nt":
        subprocess.run(
            ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
            capture_output=True,
            check=False,
        )
        try:
            proc.wait(timeout=3)
        except Exception:
            pass
        return
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait()


def free_port_if_busy(host, port):
    if not is_port_listening(host, port):
        return
    if os.name == "nt":
        out = subprocess.run(
            ["netstat", "-ano", "-p", "tcp"],
            capture_output=True,
            text=True,
            check=False,
        ).stdout
        my_pid = str(os.getpid())
        pids = set()
        target_suffix = f":{port}"
        for line in out.splitlines():
            parts = line.split()
            if len(parts) >= 5 and parts[1].endswith(target_suffix) and parts[3].upper() == "LISTENING":
                pid = parts[4]
                if pid != "0" and pid != my_pid:
                    pids.add(pid)
        for pid in pids:
            subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True, check=False)
        if pids:
            time.sleep(0.4)


def py_mtimes():
    mtimes = {}
    for path in STUDIO_DIR.rglob("*.py"):
        try:
            if path.is_file():
                mtimes[path] = path.stat().st_mtime_ns
        except OSError:
            continue
    return mtimes


def validate_py_sources(paths):
    for path in paths:
        try:
            source = path.read_bytes()
            ast.parse(source, filename=str(path))
        except (OSError, SyntaxError, ValueError) as exc:
            return False, f"{path.name}: {exc}"
    return True, None


def run_with_reloader(host, port, comfy_url, auto_worker=True):
    comfy_proc = start_comfy_worker_if_needed(comfy_url) if auto_worker else None
    last_worker_spawn = time.monotonic()
    last_studio_spawn = time.monotonic()
    env = {**os.environ, "STUDIO_WORKER": "1"}
    cmd = [sys.executable, "-m", "studio", *sys.argv[1:]]
    proc = subprocess.Popen(cmd, env=env)
    snapshot = py_mtimes()
    try:
        while True:
            time.sleep(0.6)
            if auto_worker and (comfy_proc is None or comfy_proc.poll() is not None):
                now_mono = time.monotonic()
                if now_mono - last_worker_spawn >= 10.0:
                    restarted = start_comfy_worker_if_needed(comfy_url)
                    if restarted is not None:
                        comfy_proc = restarted
                    last_worker_spawn = now_mono
            current = py_mtimes()
            if current != snapshot:
                time.sleep(0.15)
                current = py_mtimes()
                snapshot = current
                valid, err = validate_py_sources(current.keys())
                if not valid:
                    print(f"[Studio] Skip reload (syntax error in {err}); keeping active server running.", file=sys.stderr)
                    continue
                terminate_process(proc)
                free_port_if_busy(host, port)
                proc = subprocess.Popen(cmd, env=env)
                last_studio_spawn = time.monotonic()
            elif proc.poll() is not None:
                if proc.returncode == 0:
                    sys.exit(0)
                now_mono = time.monotonic()
                if now_mono - last_studio_spawn >= 3.0:
                    valid, _ = validate_py_sources(current.keys())
                    if valid:
                        free_port_if_busy(host, port)
                        proc = subprocess.Popen(cmd, env=env)
                        last_studio_spawn = now_mono
    except KeyboardInterrupt:
        pass
    finally:
        terminate_process(proc)
        terminate_process(comfy_proc)


def run_doctor(data_dir, comfy_url):
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    env = probe_gpu_environment()
    print("=== KIỂM TRA CẤU HÌNH MÁY & STUDIO (DOCTOR) ===")
    print(f"- Python: {sys.executable} ({sys.version.split()[0]})")
    if env["nvidiaSmiFound"]:
        print(f"- GPU phần cứng (nvidia-smi): {env['hardwareGpuName']} ({env['hardwareVramMB']:.0f} MB VRAM)")
    else:
        print("- GPU phần cứng (nvidia-smi): Không tìm thấy hoặc chưa cài driver NVIDIA")
    if env["torchInstalled"]:
        print(
            f"- PyTorch: {env['torchVersion']} | CUDA runtime: {env['torchCudaVersion'] or 'None'} | "
            f"torch.cuda.is_available() = {env['torchCudaAvailable']}"
        )
    else:
        print("- PyTorch: Chưa cài đặt trong môi trường hiện tại")

    if env["hardwareVramMB"] > 0 and not env["torchCudaAvailable"]:
        print("\n[!] PHÁT HIỆN LỖI QUAN TRỌNG: Máy có GPU NVIDIA nhưng venv đang cài PyTorch bản CPU!")
        print("    Chạy lệnh sau để cài PyTorch hỗ trợ GPU CUDA:")
        print(r"    .\venv\Scripts\python.exe -m pip install --upgrade --force-reinstall torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126")
    elif env["torchCudaAvailable"]:
        vram_mb = env["torchVramMB"] or env["hardwareVramMB"]
        tier = "12GB+ VRAM (DynamicVRAM)" if vram_mb >= 10000 else ("8GB VRAM (DynamicVRAM)" if vram_mb > 6500 else "<=6GB VRAM (--lowvram)")
        print(f"- Chế độ ComfyUI Worker: Sẵn sàng GPU CUDA [{tier}]")

    ckpt_dir = ROOT_DIR / "models" / "checkpoints"
    ckpts = []
    if ckpt_dir.is_dir():
        for ext in ("*.safetensors", "*.ckpt"):
            ckpts.extend(ckpt_dir.rglob(ext))
    ckpts = sorted(ckpts, key=lambda p: p.name.lower())
    print(f"\n- Thư mục checkpoint: {ckpt_dir}")
    families = []
    if not ckpts:
        print("  (Trống — chưa có file .safetensors/.ckpt nào)")
    else:
        for cp in ckpts:
            rel = str(cp.relative_to(ckpt_dir))
            fam = infer_checkpoint_family(cp.name)
            families.append(fam)
            size_gb = cp.stat().st_size / (1024.0 ** 3)
            print(f"  * {rel} | {size_gb:.2f} GB | họ model: {fam}")

    vram_eff = env["torchVramMB"] or env["hardwareVramMB"]
    if vram_eff >= 10000 and not any(f in ("flux_schnell", "flux_dev", "sdxl", "sd3") for f in families):
        print("\n[!] GỢI Ý CHO MÁY 12GB VRAM:")
        if "sd15" in families:
            print("    Hiện tại bạn mới có model SD 1.5 (giới hạn 77 token CLIP, hay cắt xén prompt dài & sai bố cục đa nhân vật).")
        print("    Để chạy local đẹp & đúng prompt dài trên 12GB VRAM, hãy tải thêm 1 trong 2 checkpoint All-in-One sau vào models\\checkpoints\\:")
        print("    1) Flux.1 Schnell FP8 (~11-17 GB, hiểu rất tốt prompt tiếng Anh tự nhiên dài 200-500 từ, 4 steps):")
        print("       https://huggingface.co/Comfy-Org/flux1-schnell/resolve/main/flux1-schnell-fp8.safetensors")
        print("    2) Animagine XL 3.1 / Illustrious XL / Juggernaut XL (~6.5 GB, tối ưu 12GB VRAM cho Anime & đa nhân vật):")
        print("       https://huggingface.co/cagliostrolab/animagine-xl-3.1/resolve/main/animagine-xl-3.1.safetensors")

    studio_up = is_port_listening("127.0.0.1", 8787)
    comfy_target = parse_local_comfy_target(comfy_url) or ("127.0.0.1", 8188)
    comfy_up = is_port_listening(comfy_target[0], comfy_target[1])
    bridge_dir = Path(data_dir) / "bridge_queue"
    pending_bridge = len(list(bridge_dir.glob("*.json"))) if bridge_dir.is_dir() else 0
    print(f"\n- Trạng thái cổng: Studio (8787) = {'ĐANG CHẠY' if studio_up else 'Chưa bật'} | ComfyUI ({comfy_target[1]}) = {'ĐANG CHẠY' if comfy_up else 'Chưa bật'}")
    print(f"- Hàng đợi Antigravity AI Bridge ({bridge_dir}): {pending_bridge} tệp")


def main():
    if len(sys.argv) > 1 and sys.argv[1].lower() == "doctor":
        doc_parser = argparse.ArgumentParser(description="Kiểm tra cấu hình máy & Studio")
        doc_parser.add_argument("--data-dir", type=Path, default=STUDIO_DIR.parent / "user" / "studio")
        doc_parser.add_argument("--comfy-url", default="http://127.0.0.1:8188")
        doc_args = doc_parser.parse_args(sys.argv[2:])
        run_doctor(doc_args.data_dir, doc_args.comfy_url)
        return
    parser = argparse.ArgumentParser(description="Studio workspace server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8787)
    parser.add_argument("--data-dir", type=Path, default=STUDIO_DIR.parent / "user" / "studio")
    parser.add_argument("--comfy-url", default="http://127.0.0.1:8188")
    parser.add_argument("--no-reload", action="store_true")
    parser.add_argument("--no-worker", action="store_true")
    args = parser.parse_args()
    if os.environ.get("STUDIO_WORKER") != "1":
        free_port_if_busy(args.host, args.port)
    if not args.no_reload and os.environ.get("STUDIO_WORKER") != "1":
        run_with_reloader(args.host, args.port, args.comfy_url, auto_worker=not args.no_worker)
        return
    comfy_proc = None
    if os.environ.get("STUDIO_WORKER") != "1" and not args.no_worker:
        comfy_proc = start_comfy_worker_if_needed(args.comfy_url)
    try:
        web.run_app(create_app(args.data_dir, args.comfy_url), host=args.host, port=args.port)
    finally:
        terminate_process(comfy_proc)


if __name__ == "__main__":
    main()
