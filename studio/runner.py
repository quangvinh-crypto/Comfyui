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
_EXTERNAL_REF_PHRASE_RE = re.compile(
    r"(?i)\b(?:the\s+(?:girl|boy|woman|man|character|person)\s+)?(?:from|in)\s+(?:the\s+)?(?:1st|2nd|3rd|first|second|third)\s+image\b[\s,]*"
)
_POSITIVE_NO_NEGATION_RE = re.compile(
    r"(?i),?\s*\bno\s+(?:text|watermarks?|signatures?|logos?)\b(?:\s*,\s*|\s+and\s+)?"
)
_REPLACE_SURROUNDINGS_RE = re.compile(
    r"(?i)\breplace\s+[^.,;]{3,60}?\bsurroundings\s+with\s+(?:a|an)\s+"
)
_SDXL_NAME_RE = re.compile(r"(?:^|[_\-\s.])(sdxl|xl|illustrious|animagine|pony|juggernaut)(?:$|[_\-\s.\d])")

ANIMAGINE_DEFAULT_NEGATIVE = (
    "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, "
    "low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, "
    "signature, extra digits, artistic error, username, scan, [abstract]"
)
GENERAL_DEFAULT_NEGATIVE = (
    "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, "
    "cropped, worst quality, low quality, jpeg artifacts, watermark, blurry"
)


def _strip_unwanted_clip_tokens(text):
    raw = str(text or "").strip()
    if not raw:
        return raw
    raw = _UNINSTALLED_CLIP_TOKENS_RE.sub(" ", raw)
    raw = _EXTERNAL_REF_PHRASE_RE.sub(" ", raw)
    raw = _POSITIVE_NO_NEGATION_RE.sub(" ", raw)
    raw = _REPLACE_SURROUNDINGS_RE.sub("", raw)
    raw = re.sub(r"\s*,\s*,+", ", ", raw)
    raw = re.sub(r"[ \t]{2,}", " ", raw)
    return raw.strip(" ,;\r\n\t")


def normalize_clip_prompt(text):
    raw = _strip_unwanted_clip_tokens(text)
    raw = re.sub(r"\s+", " ", raw).strip(" ,;\r\n\t")
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
    model_name = str(snapshot.get("model", ""))
    stem = Path(model_name).stem.lower()
    family = snapshot.get("checkpointFamily") or infer_checkpoint_family(model_name)
    is_anime_xl = any(tok in stem for tok in ("animagine", "illustrious", "pony", "noobai", "kohaku-xl"))
    raw_steps = int(snapshot.get("steps", 20))
    raw_cfg = float(snapshot.get("cfg", 7.0))
    sampler_name = "euler"
    scheduler = "normal"
    steps = raw_steps
    cfg = raw_cfg
    guidance_node = None
    quality_suffix = ""
    default_negative = ""

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
    elif family == "sdxl" and is_anime_xl:
        sampler_name = "euler_ancestral"
        scheduler = "normal"
        cfg = 6.0 if raw_cfg == 7.0 else raw_cfg
        steps = max(raw_steps, 28) if raw_steps == 20 else raw_steps
        quality_suffix = "masterpiece, best quality, very aesthetic, absurdres"
        default_negative = ANIMAGINE_DEFAULT_NEGATIVE
    elif family == "sdxl":
        sampler_name = "dpmpp_2m"
        scheduler = "karras"
        cfg = min(raw_cfg, 6.5) if raw_cfg == 7.0 else raw_cfg
        steps = max(raw_steps, 25) if raw_steps == 20 else raw_steps
        quality_suffix = "masterpiece, best quality, highres"
        default_negative = GENERAL_DEFAULT_NEGATIVE
    elif model_name != "test.safetensors":
        sampler_name = "dpmpp_2m"
        scheduler = "karras"
        steps = max(raw_steps, 25) if raw_steps == 20 else raw_steps
        default_negative = GENERAL_DEFAULT_NEGATIVE

    return {
        "family": family,
        "sampler_name": sampler_name,
        "scheduler": scheduler,
        "steps": steps,
        "cfg": cfg,
        "guidance_node": guidance_node,
        "quality_suffix": quality_suffix,
        "default_negative": default_negative,
    }


def _format_positive_and_negative(prompt_text, negative_text, sc):
    pos = normalize_clip_prompt(prompt_text)
    if sc["quality_suffix"] and pos and "best quality" not in pos.lower():
        pos = f"{pos}, {sc['quality_suffix']}"
    neg = str(negative_text or "").strip() or sc["default_negative"]
    return pos, neg


_ZONE_PREFIX = r"(?:(?<!toward\s)(?<!towards\s)(?<!facing\s)(?:occup(?:y|ies)|positioned\s+(?:in|at|on)|placed\s+(?:in|at|on)|located\s+(?:in|at|on)|stands?\s+(?:in|on|at)|sits?\s+(?:in|on|at)|lies?\s+(?:in|on|at))\s+(?:the\s+)?|(?<!toward\s)(?<!towards\s)(?<!facing\s)(?<!looking\s)\b(?:in|on|at|from|to)\s+the\s+|^)"
_REGIONAL_ZONE_SPECS = (
    ("bottom_left", re.compile(rf"(?i){_ZONE_PREFIX}(?:bottom[- ]left|lower[- ]left)(?:\s+(?:side|portion|half|corner))?|(?:ở\s+)?(?:góc\s+)?(?:dưới|phía dưới)\s+bên\s+trái"), {"x": 0.0, "y": 0.15, "width": 0.56, "height": 0.85, "strength": 1.15}),
    ("top_right", re.compile(rf"(?i){_ZONE_PREFIX}(?:upper[- ]right|top[- ]right)(?:\s+(?:side|portion|half|corner))?|(?:ở\s+)?(?:góc\s+)?(?:trên|phía trên)\s+bên\s+phải"), {"x": 0.44, "y": 0.0, "width": 0.56, "height": 0.85, "strength": 1.15}),
    ("top_left", re.compile(rf"(?i){_ZONE_PREFIX}(?:upper[- ]left|top[- ]left)(?:\s+(?:side|portion|half|corner))?|(?:ở\s+)?(?:góc\s+)?(?:trên|phía trên)\s+bên\s+trái"), {"x": 0.0, "y": 0.0, "width": 0.56, "height": 0.85, "strength": 1.15}),
    ("bottom_right", re.compile(rf"(?i){_ZONE_PREFIX}(?:bottom[- ]right|lower[- ]right)(?:\s+(?:side|portion|half|corner))?|(?:ở\s+)?(?:góc\s+)?(?:dưới|phía dưới)\s+bên\s+phải"), {"x": 0.44, "y": 0.15, "width": 0.56, "height": 0.85, "strength": 1.15}),
    ("left", re.compile(rf"(?i){_ZONE_PREFIX}left(?:\s+(?:side|portion|half))?(?:\s*[,:])?|(?:ở\s+)?bên\s+trái"), {"x": 0.0, "y": 0.0, "width": 0.55, "height": 1.0, "strength": 1.12}),
    ("right", re.compile(rf"(?i){_ZONE_PREFIX}right(?:\s+(?:side|portion|half))?(?:\s*[,:])?|(?:ở\s+)?bên\s+phải"), {"x": 0.45, "y": 0.0, "width": 0.55, "height": 1.0, "strength": 1.12}),
)
_GLOBAL_SENTENCE_START_RE = re.compile(
    r"(?i)^(?:the\s+two\s+characters|both\s+characters|their\s+fingertips|replace\s+|soft\s+\w+\s+sunlight|detailed\s+|hai\s+nhân\s+vật|cả\s+hai|khung\s+cảnh|bối\s+cảnh)"
)
_SKIP_NARRATIVE_RE = re.compile(
    r"(?i)^(?:the\s+comedy\s+comes\s+from|her\s+expression\s+suggests|his\s+expression\s+suggests|exaggerate\s+the|as\s+though\s+the\s+fate)"
)


def build_regional_clip_spec(raw_prompt, sc):
    if sc["family"] not in ("sdxl", "sd15") or sc["guidance_node"] is not None:
        return None
    cleaned = _strip_unwanted_clip_tokens(raw_prompt)
    if len(cleaned.split()) < 18:
        return None

    global_sentences = []
    zone_buckets = {}
    zone_names = {}
    zone_order = []

    for para in re.split(r"\r?\n+", cleaned):
        para = para.strip()
        if not para:
            continue
        current_zone = None
        for sent in re.split(r"(?<=[.!?])\s+", para):
            sent = sent.strip()
            if not sent or _SKIP_NARRATIVE_RE.match(sent):
                continue
            matched_zones = [z for z, pat, _ in _REGIONAL_ZONE_SPECS if pat.search(sent)]
            if len(matched_zones) >= 2 or _GLOBAL_SENTENCE_START_RE.match(sent):
                current_zone = None
                sent_clean = re.sub(r"(?i)^replace\s+[^.]*?\bsurroundings\s+with\s+(?:a|an)\s+", "", sent)
                sent_clean = re.sub(r"(?i)\bbut\s+replacing\s+[^,]+?\s+with\s+(?:the\s+extremely\s+important\s+act\s+of\s+)?", "sharing ", sent_clean)
                global_sentences.append(sent_clean.strip())
            elif len(matched_zones) == 1:
                current_zone = matched_zones[0]
                if current_zone not in zone_buckets:
                    zone_buckets[current_zone] = []
                    zone_order.append(current_zone)
                name_m = re.match(r"^([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b", sent)
                if name_m and name_m.group(1).lower() not in ("with", "from", "while", "after", "before", "under"):
                    zone_names[current_zone] = name_m.group(1)
                zone_buckets[current_zone].append(sent)
            elif current_zone:
                zone_buckets[current_zone].append(sent)
            else:
                sent_clean = re.sub(r"(?i)\bbut\s+replacing\s+[^,]+?\s+with\s+(?:the\s+extremely\s+important\s+act\s+of\s+)?", "", sent)
                global_sentences.append(sent_clean.strip())

    if len(zone_order) < 2:
        return None

    spec_lookup = {z: coords for z, _, coords in _REGIONAL_ZONE_SPECS}
    regions = []
    girl_count = 0
    boy_count = 0

    for z in zone_order:
        reg_raw = " ".join(zone_buckets[z])
        for other_z, full_name in zone_names.items():
            if other_z == z or not full_name:
                continue
            tokens = [full_name] + [p for p in full_name.split() if len(p) >= 3]
            for tok in tokens:
                reg_raw = re.sub(rf"(?i)\b{re.escape(tok)}(?:'s|’s)\b", "the", reg_raw)
                reg_raw = re.sub(rf"(?i)\b{re.escape(tok)}\b", "", reg_raw)
        reg_raw = re.sub(r"\s{2,}", " ", reg_raw).strip(" ,")
        low = reg_raw.lower()
        if re.search(r"\b(?:she|her|hers|girl|woman|female)\b|cô gái|thiếu nữ|phụ nữ|nữ|cô ấy|nàng", low):
            subj_tag = "1girl"
            girl_count += 1
        elif re.search(r"\b(?:he|him|his|boy|man|male)\b|chàng trai|đàn ông|cậu bé|anh ấy|nam", low):
            subj_tag = "1boy"
            boy_count += 1
        else:
            subj_tag = "1person"
        reg_norm = normalize_clip_prompt(f"{subj_tag}, {reg_raw}")
        if sc["quality_suffix"] and "best quality" not in reg_norm.lower():
            reg_norm = f"{reg_norm}, {sc['quality_suffix']}"
        regions.append({"zone": z, "prompt": reg_norm, **spec_lookup[z]})

    if girl_count >= 2 and boy_count == 0:
        count_prefix = f"{girl_count}girls, multiple girls, wide shot"
    elif boy_count >= 2 and girl_count == 0:
        count_prefix = f"{boy_count}boys, multiple boys, wide shot"
    elif girl_count >= 1 and boy_count >= 1:
        count_prefix = f"{girl_count}girl, {boy_count}boy, {girl_count + boy_count}people, wide shot"
    else:
        count_prefix = f"{len(regions)}people, wide shot"

    global_body = " ".join(s for s in global_sentences if s).strip()
    global_norm = normalize_clip_prompt(f"{count_prefix}, {global_body}" if global_body else count_prefix)
    if sc["quality_suffix"] and "best quality" not in global_norm.lower():
        global_norm = f"{global_norm}, {sc['quality_suffix']}"

    return {"globalPrompt": global_norm, "regions": regions}


def _apply_regional_conditioning(graph, regional):
    pos_ref = ["2", 0]
    next_id = 10
    for reg in regional["regions"]:
        enc_id = str(next_id)
        area_id = str(next_id + 1)
        comb_id = str(next_id + 2)
        graph[enc_id] = {"class_type": "CLIPTextEncode", "inputs": {"text": reg["prompt"], "clip": ["1", 1]}}
        graph[area_id] = {
            "class_type": "ConditioningSetAreaPercentage",
            "inputs": {
                "conditioning": [enc_id, 0],
                "width": reg["width"],
                "height": reg["height"],
                "x": reg["x"],
                "y": reg["y"],
                "strength": reg["strength"],
            },
        }
        graph[comb_id] = {
            "class_type": "ConditioningCombine",
            "inputs": {"conditioning_1": pos_ref, "conditioning_2": [area_id, 0]},
        }
        pos_ref = [comb_id, 0]
        next_id += 3
    return pos_ref


def _resolve_prompt_conditioning(prompt_text, negative_text, sc):
    regional = build_regional_clip_spec(prompt_text, sc)
    if regional is not None:
        pos_text = regional["globalPrompt"]
        neg_text = str(negative_text or "").strip() or sc["default_negative"]
        if neg_text and "solo" not in neg_text.lower():
            neg_text = f"{neg_text}, solo"
        return pos_text, neg_text, regional
    pos_text, neg_text = _format_positive_and_negative(prompt_text, negative_text, sc)
    return pos_text, neg_text, None


def text_image_prompt(snapshot, run_id):
    latent_w, latent_h = snapshot["width"], snapshot["height"]
    max_edge = int(snapshot.get("maxLatentEdge") or 768)
    if snapshot.get("vramSafeLatent"):
        latent_w, latent_h = vram_safe_latent_dims(latent_w, latent_h, max_edge=max_edge)
    sc = _sampler_config_for_snapshot(snapshot)
    pos_text, neg_text, regional = _resolve_prompt_conditioning(snapshot["prompt"], snapshot["negative"], sc)
    positive_ref = ["9", 0] if sc["guidance_node"] is not None else ["2", 0]
    graph = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": snapshot["model"]}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": pos_text, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": neg_text, "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage", "inputs": {"width": latent_w, "height": latent_h, "batch_size": 1}},
        "5": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": positive_ref, "negative": ["3", 0], "latent_image": ["4", 0], "seed": snapshot["seed"], "steps": sc["steps"], "cfg": sc["cfg"], "sampler_name": sc["sampler_name"], "scheduler": sc["scheduler"], "denoise": 1.0}},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage", "inputs": {"images": ["6", 0], "filename_prefix": f"Studio_{run_id}"}},
    }
    if sc["guidance_node"] is not None:
        graph["9"] = sc["guidance_node"]
    elif regional is not None:
        graph["5"]["inputs"]["positive"] = _apply_regional_conditioning(graph, regional)
    return graph


def image_image_prompt(snapshot, run_id, image_name):
    sc = _sampler_config_for_snapshot(snapshot)
    pos_text, neg_text, regional = _resolve_prompt_conditioning(snapshot.get("prompt", ""), snapshot.get("negative", ""), sc)
    positive_ref = ["9", 0] if sc["guidance_node"] is not None else ["2", 0]
    graph = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": snapshot["model"]}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": pos_text, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": neg_text, "clip": ["1", 1]}},
        "4": {"class_type": "LoadImage", "inputs": {"image": image_name}},
        "5": {"class_type": "VAEEncode", "inputs": {"pixels": ["4", 0], "vae": ["1", 2]}},
        "6": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": positive_ref, "negative": ["3", 0], "latent_image": ["5", 0], "seed": snapshot["seed"], "steps": sc["steps"], "cfg": sc["cfg"], "sampler_name": sc["sampler_name"], "scheduler": sc["scheduler"], "denoise": snapshot.get("denoise", 0.75)}},
        "7": {"class_type": "VAEDecode", "inputs": {"samples": ["6", 0], "vae": ["1", 2]}},
        "8": {"class_type": "SaveImage", "inputs": {"images": ["7", 0], "filename_prefix": f"Studio_{run_id}"}},
    }
    if sc["guidance_node"] is not None:
        graph["9"] = sc["guidance_node"]
    elif regional is not None:
        graph["6"]["inputs"]["positive"] = _apply_regional_conditioning(graph, regional)
    return graph


def history_error(history):
    for message in reversed(history.get("status", {}).get("messages", [])):
        if len(message) > 2 and message[1] == "execution_error":
            return message[2].get("exception_message") or "ComfyUI không thể chạy workflow."
    return "ComfyUI không thể chạy workflow."
