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

STUDIO_DIR = Path(__file__).resolve().parent
ROOT_DIR = STUDIO_DIR.parent


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
            gpu_name = parts[0].lower() if parts else ""
            vram_mb = float(parts[1]) if len(parts) > 1 else 0.0
            if vram_mb <= 6500 or "1650" in gpu_name or "1660" in gpu_name:
                flags.extend(["--lowvram", "--fp32-vae", "--force-upcast-attention"])
            return flags
    except Exception:
        pass
    try:
        import torch

        if torch.cuda.is_available():
            gpu_name = (torch.cuda.get_device_name(0) or "").lower()
            props = torch.cuda.get_device_properties(0)
            vram_mb = float(getattr(props, "total_memory", 0)) / (1024.0 * 1024.0)
            if vram_mb <= 6500 or "1650" in gpu_name or "1660" in gpu_name:
                flags.extend(["--lowvram", "--fp32-vae", "--force-upcast-attention"])
            return flags
    except Exception:
        pass
    flags.append("--cpu")
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


def main():
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
