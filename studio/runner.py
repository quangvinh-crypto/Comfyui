import hashlib
import re

from pathlib import Path
from aiohttp import ClientTimeout, FormData

VI_CLIP_HINTS = (
    ("cô gái", "young woman"),
    ("thiếu nữ", "young woman"),
    ("chàng trai", "young man"),
    ("đàn ông", "man"),
    ("phụ nữ", "woman"),
    ("em bé", "child"),
    ("công chúa", "princess"),
    ("hoàng tử", "prince"),
    ("chiến binh", "warrior"),
    ("người máy", "futuristic robot"),
    ("nhân vật", "character"),
    ("chân dung", "portrait"),
    ("áo dài", "traditional Vietnamese ao dai dress"),
    ("cổ trang", "historical fantasy costume"),
    ("trang phục", "detailed outfit"),
    ("căn phòng sang trọng", "luxury interior room"),
    ("căn phòng", "interior room"),
    ("ngôi nhà", "house"),
    ("kiến trúc", "architectural design"),
    ("thành phố", "cityscape"),
    ("đường phố", "street scene"),
    ("xe hơi", "modern car"),
    ("ô tô", "modern car"),
    ("núi tuyết", "snowy mountain peak"),
    ("rừng", "forest"),
    ("biển", "ocean beach"),
    ("vũ trụ", "cosmic space"),
    ("bầu trời", "sky"),
    ("hoa sen", "lotus flower"),
    ("đại bàng", "majestic eagle soaring"),
    ("con rồng", "dragon"),
    ("rồng", "dragon"),
    ("con mèo", "cat"),
    ("mèo", "cat"),
    ("con chó", "dog"),
    ("chó", "dog"),
    ("hoàng hôn", "golden sunset lighting"),
    ("bình minh", "sunrise glow"),
    ("ban đêm", "night scene, atmospheric lighting"),
    ("ánh sáng", "cinematic lighting"),
    ("mưa", "rain"),
    ("tuyết", "snow"),
    ("phong cách", "artistic style"),
    ("hoạt hình", "anime illustration"),
    ("chân thực", "photorealistic, 8k uhd"),
    ("điện ảnh", "cinematic composition"),
)

VI_ASCII_CLIP_HINTS = (
    ("co gai", "young woman"),
    ("thieu nu", "young woman"),
    ("chang trai", "young man"),
    ("dan ong", "man"),
    ("phu nu", "woman"),
    ("em be", "child"),
    ("cong chua", "princess"),
    ("hoang tu", "prince"),
    ("chien binh", "warrior"),
    ("nguoi may", "futuristic robot"),
    ("nhan vat", "character"),
    ("chan dung", "portrait"),
    ("ao dai", "traditional Vietnamese ao dai dress"),
    ("co trang", "historical fantasy costume"),
    ("trang phuc", "detailed outfit"),
    ("can phong sang trong", "luxury interior room"),
    ("can phong", "interior room"),
    ("ngoi nha", "house"),
    ("kien truc", "architectural design"),
    ("thanh pho", "cityscape"),
    ("duong pho", "street scene"),
    ("xe hoi", "modern car"),
    ("nui tuyet", "snowy mountain peak"),
    ("vu tru", "cosmic space"),
    ("bau troi", "sky"),
    ("hoa sen", "lotus flower"),
    ("dai bang", "majestic eagle soaring"),
    ("con rong", "dragon"),
    ("con meo", "cat"),
    ("con cho", "dog"),
    ("hoang hon", "golden sunset lighting"),
    ("binh minh", "sunrise glow"),
    ("ban dem", "night scene, atmospheric lighting"),
    ("anh sang", "cinematic lighting"),
    ("phong cach", "artistic style"),
    ("hoat hinh", "anime illustration"),
    ("chan thuc", "photorealistic, 8k uhd"),
    ("dien anh", "cinematic composition"),
)


_UNINSTALLED_CLIP_TOKENS_RE = re.compile(
    r"(?i)(?<!embedding:)(?<!\w)(?:lazypos|lazyneg|easynegative|badhandv4|verybadimagenegative_v1\.3|ng_deepnegative_v1_75t)(?!\w)[\s,;]*"
)
_SDXL_NAME_RE = re.compile(r"(?:^|[_\-\s.])(sdxl|xl|illustrious|animagine|pony|juggernaut)(?:$|[_\-\s.\d])")


def normalize_clip_prompt(text):
    raw = str(text or "").strip()
    if not raw:
        return raw
    raw = _UNINSTALLED_CLIP_TOKENS_RE.sub(" ", raw)
    raw = re.sub(r"\s{2,}", " ", raw).strip(" ,;\r\n\t")
    if not raw:
        return raw
    has_non_ascii = any(ord(ch) >= 128 for ch in raw)
    lower = raw.lower()
    matched = []
    if has_non_ascii:
        for vi_phrase, en_phrase in VI_CLIP_HINTS:
            if re.search(r"(?<!\w)" + re.escape(vi_phrase) + r"(?!\w)", lower):
                if en_phrase not in matched:
                    matched.append(en_phrase)
    for vi_ascii, en_phrase in VI_ASCII_CLIP_HINTS:
        if re.search(r"(?<!\w)" + re.escape(vi_ascii) + r"(?!\w)", lower):
            if en_phrase not in matched:
                matched.append(en_phrase)
    if not has_non_ascii and not matched:
        return raw
    if matched:
        return f"{', '.join(matched)}, {raw}, high detail, sharp focus"
    return f"{raw}, high detail, sharp focus"


def infer_checkpoint_family(ckpt_name):
    stem = Path(str(ckpt_name or "")).stem.strip().lower()
    if not stem:
        return "sd15"
    if "flux" in stem and "schnell" in stem:
        return "flux_schnell"
    if "flux" in stem:
        return "flux_dev"
    if "sd3" in stem:
        return "sd3"
    if any(tok in stem for tok in ("sdxl", "illustrious", "animagine", "juggernautxl", "ponyxl", "kohaku-xl", "dreamshaperxl", "realvisxl")) or _SDXL_NAME_RE.search(stem):
        return "sdxl"
    return "sd15"


def select_best_checkpoint(checkpoints, vram_mb=0):
    if not checkpoints:
        return ""
    vram = float(vram_mb or 0)
    if vram >= 10000:
        weights = {"flux_schnell": 50, "flux_dev": 45, "sd3": 40, "sdxl": 35, "sd15": 10}
    elif vram > 6500:
        weights = {"sdxl": 45, "flux_schnell": 40, "sd3": 30, "flux_dev": 25, "sd15": 15}
    else:
        weights = {"sd15": 30, "sdxl": 20, "sd3": 15, "flux_schnell": 10, "flux_dev": 5}
    return max(
        enumerate(checkpoints),
        key=lambda item: (weights.get(infer_checkpoint_family(item[1]), 10), -item[0]),
    )[1]


def recommended_max_edge(vram_mb, family):
    vram = float(vram_mb or 0)
    if vram <= 6500:
        return 768
    if family == "sd15":
        return 960
    if vram >= 10000:
        return 1536
    return 1280


def vram_safe_latent_dims(width, height, max_edge=768):
    w = max(64, int(width or 512))
    h = max(64, int(height or 512))
    peak = max(w, h)
    if peak <= max_edge:
        return (w // 16) * 16, (h // 16) * 16
    scale = float(max_edge) / float(peak)
    sw = max(256, int(round((w * scale) / 16.0)) * 16)
    sh = max(256, int(round((h * scale) / 16.0)) * 16)
    return sw, sh


class ComfyClient:
    def __init__(self, session, base_url):
        self.session = session
        self.base_url = base_url.rstrip("/")

    async def checkpoints(self):
        async with self.session.get(f"{self.base_url}/object_info/CheckpointLoaderSimple", timeout=ClientTimeout(total=10)) as response:
            response.raise_for_status()
            data = await response.json()
        node = data.get("CheckpointLoaderSimple", {})
        return node.get("input", {}).get("required", {}).get("ckpt_name", [[]])[0]

    async def system_stats(self):
        try:
            async with self.session.get(f"{self.base_url}/system_stats", timeout=ClientTimeout(total=4)) as response:
                if response.status != 200:
                    return None
                data = await response.json()
        except Exception:
            return None
        devices = data.get("devices") if isinstance(data, dict) else None
        if not isinstance(devices, list) or not devices:
            return None
        cuda_dev = next(
            (d for d in devices if isinstance(d, dict) and str(d.get("type") or "").lower().startswith("cuda")),
            devices[0],
        )
        if not isinstance(cuda_dev, dict):
            return None
        return {
            "deviceType": str(cuda_dev.get("type") or "unknown").lower(),
            "gpuName": str(cuda_dev.get("name") or ""),
            "vramTotalMB": round(float(cuda_dev.get("vram_total") or 0) / 1048576.0, 1),
            "vramFreeMB": round(float(cuda_dev.get("vram_free") or 0) / 1048576.0, 1),
        }

    async def submit(self, prompt_id, graph):
        async with self.session.post(f"{self.base_url}/prompt", json={"prompt_id": prompt_id, "prompt": graph}, timeout=ClientTimeout(total=30)) as response:
            data = await response.json()
            if response.status >= 400:
                error = data.get("error", {})
                message = error.get("message") if isinstance(error, dict) else str(error)
                raise ValueError(message or "ComfyUI từ chối workflow.")
        return data["prompt_id"]

    async def upload_image(self, source_path, mime, name):
        form = FormData()
        with source_path.open("rb") as source:
            form.add_field("image", source, filename=name, content_type=mime)
            async with self.session.post(f"{self.base_url}/upload/image", data=form, timeout=ClientTimeout(total=120)) as response:
                response.raise_for_status()
                data = await response.json()
        return data["name"]

    async def history(self, prompt_id):
        async with self.session.get(f"{self.base_url}/history/{prompt_id}", timeout=ClientTimeout(total=10)) as response:
            response.raise_for_status()
            return (await response.json()).get(prompt_id)

    async def queue_state(self, prompt_id):
        async with self.session.get(f"{self.base_url}/queue", timeout=ClientTimeout(total=10)) as response:
            response.raise_for_status()
            queue = await response.json()
        if any(item[1] == prompt_id for item in queue.get("queue_running", [])):
            return "running"
        if any(item[1] == prompt_id for item in queue.get("queue_pending", [])):
            return "queued"
        return None

    async def download_image(self, image, destination):
        params = {"filename": image["filename"], "subfolder": image.get("subfolder", ""), "type": image.get("type", "output")}
        async with self.session.get(f"{self.base_url}/view", params=params, timeout=ClientTimeout(total=120)) as response:
            response.raise_for_status()
            size = 0
            digest = hashlib.sha256()
            with destination.open("wb") as output:
                async for chunk in response.content.iter_chunked(256 * 1024):
                    size += len(chunk)
                    if size > 512 * 1024 * 1024:
                        raise ValueError("Ảnh kết quả vượt giới hạn 512 MB.")
                    if size == len(chunk) and not chunk.startswith(b"\x89PNG\r\n\x1a\n"):
                        raise ValueError("Kết quả ComfyUI không phải ảnh PNG.")
                    digest.update(chunk)
                    output.write(chunk)
        return size, digest.hexdigest()


def _sampler_config_for_snapshot(snapshot):
    family = snapshot.get("checkpointFamily") or infer_checkpoint_family(snapshot.get("model", ""))
    raw_steps = int(snapshot.get("steps", 20))
    raw_cfg = float(snapshot.get("cfg", 7.0))
    sampler_name = "euler"
    scheduler = "normal"
    steps = raw_steps
    cfg = raw_cfg
    guidance_node = None

    if family == "flux_schnell":
        sampler_name = "euler"
        scheduler = "simple"
        cfg = 1.0
        steps = 4 if raw_steps == 20 else min(raw_steps, 12)
        guidance_node = {"class_type": "FluxDisableGuidance", "inputs": {"conditioning": ["2", 0]}}
    elif family == "flux_dev":
        sampler_name = "euler"
        scheduler = "simple"
        cfg = 1.0
        steps = raw_steps
        guidance_node = {"class_type": "FluxGuidance", "inputs": {"conditioning": ["2", 0], "guidance": 3.5}}
    elif family == "sdxl":
        sampler_name = "dpmpp_2m"
        scheduler = "karras"
        cfg = min(raw_cfg, 6.5) if raw_cfg == 7.0 else raw_cfg
        steps = max(raw_steps, 25) if raw_steps == 20 else raw_steps
    elif snapshot.get("model") != "test.safetensors":
        sampler_name = "dpmpp_2m"
        scheduler = "karras"
        steps = max(raw_steps, 25) if raw_steps == 20 else raw_steps

    return {
        "family": family,
        "sampler_name": sampler_name,
        "scheduler": scheduler,
        "steps": steps,
        "cfg": cfg,
        "guidance_node": guidance_node,
    }


def text_image_prompt(snapshot, run_id):
    latent_w, latent_h = snapshot["width"], snapshot["height"]
    max_edge = int(snapshot.get("maxLatentEdge") or 768)
    if snapshot.get("vramSafeLatent"):
        latent_w, latent_h = vram_safe_latent_dims(latent_w, latent_h, max_edge=max_edge)
    sc = _sampler_config_for_snapshot(snapshot)
    positive_ref = ["9", 0] if sc["guidance_node"] is not None else ["2", 0]
    graph = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": snapshot["model"]}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": normalize_clip_prompt(snapshot["prompt"]), "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": snapshot["negative"], "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage", "inputs": {"width": latent_w, "height": latent_h, "batch_size": 1}},
        "5": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": positive_ref, "negative": ["3", 0], "latent_image": ["4", 0], "seed": snapshot["seed"], "steps": sc["steps"], "cfg": sc["cfg"], "sampler_name": sc["sampler_name"], "scheduler": sc["scheduler"], "denoise": 1.0}},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage", "inputs": {"images": ["6", 0], "filename_prefix": f"Studio_{run_id}"}},
    }
    if sc["guidance_node"] is not None:
        graph["9"] = sc["guidance_node"]
    return graph


def image_image_prompt(snapshot, run_id, image_name):
    sc = _sampler_config_for_snapshot(snapshot)
    positive_ref = ["9", 0] if sc["guidance_node"] is not None else ["2", 0]
    graph = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": snapshot["model"]}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": normalize_clip_prompt(snapshot.get("prompt", "")), "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": snapshot.get("negative", ""), "clip": ["1", 1]}},
        "4": {"class_type": "LoadImage", "inputs": {"image": image_name}},
        "5": {"class_type": "VAEEncode", "inputs": {"pixels": ["4", 0], "vae": ["1", 2]}},
        "6": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": positive_ref, "negative": ["3", 0], "latent_image": ["5", 0], "seed": snapshot["seed"], "steps": sc["steps"], "cfg": sc["cfg"], "sampler_name": sc["sampler_name"], "scheduler": sc["scheduler"], "denoise": snapshot.get("denoise", 0.75)}},
        "7": {"class_type": "VAEDecode", "inputs": {"samples": ["6", 0], "vae": ["1", 2]}},
        "8": {"class_type": "SaveImage", "inputs": {"images": ["7", 0], "filename_prefix": f"Studio_{run_id}"}},
    }
    if sc["guidance_node"] is not None:
        graph["9"] = sc["guidance_node"]
    return graph


def history_error(history):
    for message in reversed(history.get("status", {}).get("messages", [])):
        if len(message) > 2 and message[1] == "execution_error":
            return message[2].get("exception_message") or "ComfyUI không thể chạy workflow."
    return "ComfyUI không thể chạy workflow."
