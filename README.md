<div align="center">

# ComfyUI · Spaces Studio

**Không gian sáng tạo node-based (Text, Image, Video, Audio & 3D) xây dựng trên nền tảng ComfyUI Core.**

[![Python](https://img.shields.io/badge/Python-3.12%20%7C%203.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![ComfyUI](https://img.shields.io/badge/ComfyUI-Core%20v0.35.0-0EA5E9)](https://github.com/comfyanonymous/ComfyUI)
[![Studio](https://img.shields.io/badge/Studio-Node%20Canvas-8B5CF6)](#-tính-năng-nổi-bật)

</div>

---

## Giới thiệu dự án

Kho mã nguồn này kết hợp **ComfyUI Core** (engine thực thi đồ thị node AI) cùng **Spaces Studio** (`studio/`) — giao diện canvas trực quan theo phong cách node workflow giúp kết nối liền mạch các luồng xử lý **Text → Image → Video → Audio → 3D** ngay trên trình duyệt tại địa chỉ cục bộ.

Toàn bộ thư viện bên thứ ba (`venv/`, `node_modules/`), dữ liệu người dùng (`user/`), model weights (`models/`), và video tham khảo (`downloads/`) đều đã được loại trừ qua `.gitignore` để repository gọn nhẹ khi đồng bộ lên GitHub.

---

## Tính năng nổi bật

### 1. Spaces Studio Canvas (`studio/`)
- **Quản lý dự án & Lưu trữ cục bộ**: Tạo nhiều không gian làm việc, tự động lưu flow vào SQLite (`user/studio/studio.db`), hỗ trợ Undo/Redo, Group khung nhóm node, Sticky note, kéo/zoom/pan, cắt dây nối, và Thùng rác (xóa tạm / xóa vĩnh viễn tệp).
- **Quản lý Media & Nơi lưu kết quả**: Hỗ trợ upload và quản lý PNG, JPEG, WebP, WAV, MP3, MP4, WebM, GLB (tối đa `512 MB`/tệp); cho phép cấu hình thư mục lưu đầu ra tùy chọn.
- **Thẻ nguồn & Tiện ích**:
  - `Text`, `Image`, `Video`, `Audio`, `Assistant`, `List` (xử lý danh sách & chạy Batch `N×M`), `Group`, `Sticky note`.
- **Tạo & Chỉnh sửa Ảnh**:
  - `Image Generator` (`text-image`): Tạo ảnh từ prompt văn bản hoặc kèm ảnh tham chiếu (`@Tên_Card`).
  - `Image Editor` (`image-image`): Hỗ trợ *Crop Image*, *Image Extender*, *Change camera angle*, *Remove background*, *Adjust colors*, *Relight*, *Skin Enhancer*, *Variations*.
  - `Image Upscaler` (`upscaler`): Nâng cấp độ phân giải ảnh.
- **Tạo & Xử lý Video**:
  - `Video Generator` (`text-video`), `Image → Video` (`image-video`), `Extend video`, `Video Modify`, `Move` (3D Parallax), `Video → Video`, `Speak` (Lip-Sync), `Video Combiner`, `Video Upscaler`, `Media Extractor` (tách frame/clip/audio), `Video SFX`.
- **Âm thanh & Thiết kế**:
  - `Speech to Text`, `Voiceover`, `Sound Effects`, `Audio Generator`, `Music Generator`, `Designer`, `Image to SVG`, `SVG Generator`.
- **Thiết kế 3D**:
  - `3D Generator` (`3d-generator`): Hỗ trợ dựng khối 3D `.glb` từ ảnh 2D / prompt và xem trước kết quả.
- **Chạy song song Local GPU & Model API / Bridge**:
  - Có thể chọn `Local GPU (VRAM)` để gửi job sang **ComfyUI GPU Worker** (`http://127.0.0.1:8188`) hoặc chạy các model qua API / Bridge độc lập.
  - Hot-reload tự động khi chỉnh sửa mã nguồn trong `studio/`.

### 2. ComfyUI Core Engine (`main.py`, `comfy/`, `comfy_extras/`)
- Hỗ trợ kiến trúc node đồ thị của ComfyUI Core v0.35.0 cùng quản lý bộ nhớ VRAM/RAM thông minh (`--lowvram`, `--fp32-vae`, offload model).
- Tương thích đa dạng họ model khuếch tán ảnh, video, audio, 3D và vision của ComfyUI.

---

## Cấu trúc thư mục mã nguồn

```text
.
├── main.py                     # Điểm khởi chạy ComfyUI Core Worker
├── server.py / execution.py    # HTTP/WebSocket server & bộ thực thi đồ thị node ComfyUI
├── nodes.py / comfy/           # Các node chuẩn & kiến trúc model trong ComfyUI
├── comfy_extras/ / comfy_api/  # Node mở rộng, 3D mesh, video, audio & API nodes
├── studio/                     # Mã nguồn ứng dụng Spaces Studio
│   ├── __main__.py             # CLI khởi chạy Studio + tự động bật ComfyUI Worker + hot-reload
│   ├── app.py                  # Backend aiohttp, REST API, SQLite, xử lý ảnh/video/3D
│   ├── runner.py               # Client giao tiếp với ComfyUI (/prompt, /queue, /history)
│   ├── test_app.py             # Bộ kiểm thử tự động API & luồng Studio
│   └── web/                    # Frontend thuần HTML/CSS/JS (index.html, app.js, style.css)
├── docs/                       # Tài liệu phân tích kiến trúc, UI & luồng dữ liệu Studio
├── studio.cmd / studio.ps1     # Script khởi chạy nhanh trên Windows
├── HUONG_DAN_CHAY_DU_AN.md     # Hướng dẫn vận hành chi tiết bằng tiếng Việt
└── requirements.txt            # Danh sách gói Python cần thiết
```

---

## Yêu cầu cấu hình máy (Chạy Local)

| Mức cấu hình | Phần cứng đề xuất | Phạm vi sử dụng |
| :--- | :--- | :--- |
| **Mức 1 — Tối thiểu** | CPU 4 nhân+, RAM `8–16 GB`, GPU tích hợp hoặc GPU `4 GB VRAM` (VD: GTX 1650), trống `10–20 GB` SSD | Chạy mượt toàn bộ Spaces Studio UI (`127.0.0.1:8787`), các luồng xử lý cục bộ, dựng 3D `.glb` cơ bản, cắt/ghép video và chạy qua AI Bridge / API |
| **Mức 2 — Khuyến nghị** | CPU i5/Ryzen 5+, RAM `16–32 GB`, NVIDIA RTX `8–12 GB VRAM` (VD: RTX 3060/4060), trống `50–100 GB` SSD | Chạy tốt các model tạo ảnh AI offline trên ComfyUI Worker (`SD 1.5`, `SDXL`, `Flux` lượng tử hóa) |
| **Mức 3 — Chuyên sâu** | CPU 8 nhân+, RAM `32–64 GB`, NVIDIA RTX `16–24 GB VRAM` (RTX 3090/4080/4090), trống `150+ GB` SSD | Render trực tiếp các model Video AI / 3D AI dung lượng lớn ngay trên máy cục bộ |

> **Lưu ý cấu hình GPU & VRAM:**
> - Chạy `.\studio doctor` để kiểm tra `torch.cuda.is_available()`, phiên bản PyTorch CUDA và phân loại model trong `models/checkpoints`.
> - Nếu `venv` đang cài nhầm `torch+cpu`, `.\studio` sẽ cảnh báo và tự lùi về `--cpu` để ComfyUI Worker vẫn khởi động được thay vì crash; cài lại bản CUDA (`--index-url https://download.pytorch.org/whl/cu126`) để chạy bằng GPU.
> - Launcher tự gắn `--lowvram --fp32-vae --force-upcast-attention` cho GPU `<= 6 GB VRAM`, và `--normalvram` cho GPU `8–12 GB VRAM`.
> - Máy `12 GB VRAM` nên dùng checkpoint All-in-One **Flux.1 Schnell FP8** (`flux1-schnell-fp8.safetensors`) hoặc **SDXL / Animagine XL 3.1** thay cho SD 1.5 (`77 token`) để bám sát prompt dài và bố cục đa nhân vật.

---

## Cài đặt & Khởi chạy

### 1. Tạo môi trường ảo & cài đặt thư viện

Yêu cầu **Python 3.12** hoặc **Python 3.13**:

```powershell
git clone https://github.com/quangvinh-crypto/Comfyui.git
cd Comfyui

python -m venv venv
.\venv\Scripts\Activate.ps1

# Cài PyTorch bản hỗ trợ GPU NVIDIA CUDA (hoặc chọn phiên bản CUDA phù hợp tại pytorch.org)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126

# Cài các thư viện phụ thuộc của dự án
pip install -r requirements.txt

# Kiểm tra cấu hình GPU, PyTorch CUDA & model checkpoint
.\studio doctor
```

*(Tùy chọn)* Đặt các file model checkpoint `.safetensors` (ví dụ `flux1-schnell-fp8.safetensors` hoặc model SDXL/Animagine XL cho máy `12 GB VRAM`) vào thư mục `models/checkpoints/` nếu muốn render ảnh trực tiếp bằng **`Local GPU (VRAM)`**.
Nếu chọn **`Antigravity AI Bridge`**, Studio ghi job vào `user/studio/bridge_queue/<run_id>.json` cho Agent xử lý và hỗ trợ nút **Stop (■)** ngay trên thẻ để hủy nhanh khi không có Agent trực.

### 2. Chạy toàn bộ dự án bằng 1 lệnh (Windows)

Tại thư mục gốc dự án:

```powershell
.\studio
```

Lệnh này tự động khởi chạy đồng thời:
1. **Spaces Studio UI**: <http://127.0.0.1:8787> (hoặc <http://127.0.0.1:8787/studio/>)
2. **ComfyUI Worker** chạy nền tại: <http://127.0.0.1:8188/>

Hoặc chạy trực tiếp bằng Python trên Windows / Linux / macOS:

```bash
python -m studio
```

### 3. Các tùy chọn dòng lệnh khác

```powershell
# Đổi cổng Studio
.\studio --port 8790

# Chỉ định thư mục lưu dữ liệu riêng (SQLite & assets)
.\studio --data-dir "E:\AI\Cao\studio-data"

# Kết nối tới một ComfyUI Worker bên ngoài & tắt tự bật worker
.\studio --no-worker --comfy-url "http://127.0.0.1:8188"

# Chỉ chạy ComfyUI Core Worker (không kèm Studio UI)
.\studio worker
```

---

## Kiểm thử (Testing)

Chạy bộ unit test kiểm tra API, validation đồ thị, upload media, lưu trữ và các luồng Image / Video / 3D của Studio:

```powershell
.\studio test
# Hoặc:
python -m unittest studio.test_app -v
```

---

## Phím tắt trên Canvas

| Phím tắt | Chức năng |
| :--- | :--- |
| `N` | Mở bảng thêm thẻ Node |
| `V` / `H` / `Space` | Công cụ Chọn (`Select`) / Kéo bảng vẽ (`Pan`) |
| `C` | Công cụ cắt dây nối (`Cut`) |
| `G` | Tạo khung nhóm (`Group`) |
| `Ctrl + Z` / `Ctrl + Shift + Z` | Hoàn tác / Làm lại |
| `Delete` / `Backspace` | Xóa node hoặc dây nối đang chọn |

---

## Tài liệu liên quan

- [Hướng dẫn chạy dự án chi tiết (`HUONG_DAN_CHAY_DU_AN.md`)](HUONG_DAN_CHAY_DU_AN.md)
- [Tài liệu thiết kế Studio (`docs/README.md`)](docs/README.md)
- [Ghi chú kỹ thuật Studio (`studio/README.md`)](studio/README.md)
- [Thông tin lượng tử hóa model ComfyUI (`QUANTIZATION.md`)](QUANTIZATION.md)
