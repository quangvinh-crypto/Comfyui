# Hướng dẫn chạy dự án

Các lệnh bên dưới được chạy trong Terminal tại thư mục gốc của dự án:

```text
E:\AI\Cao\comfyui
```

Nếu Terminal đang hiện `PS E:\AI\Cao\comfyui>`, bạn có thể dùng ngay lệnh rút gọn `.\studio`.

## 1. Kiểm tra cấu hình máy trước khi chạy (`.\studio doctor`)

Trước khi bật dự án trên máy có GPU (ví dụ RTX 12GB VRAM), chạy lệnh chẩn đoán tự động:

```powershell
.\studio doctor
```

Lệnh này kiểm tra:
- **GPU phần cứng (`nvidia-smi`) vs `torch.cuda.is_available()`**: Nếu `pip install -r requirements.txt` mới cài bản PyTorch CPU (`+cpu`), `doctor` sẽ báo cảnh báo và in sẵn lệnh cài lại PyTorch bản GPU CUDA (`cu126`), còn `.\studio` sẽ tự chuyển ComfyUI sang `--cpu` để không bị crash cổng `8188`.
- **Họ checkpoint trong `models\checkpoints`**: Phân loại tự động `sd15`, `sdxl`, `flux_schnell`, `flux_dev`, cảnh báo nếu máy 12GB VRAM mới chỉ có model SD 1.5 (như `DreamShaper_8_pruned.safetensors` giới hạn 77 token).

## 2. Chạy toàn bộ dự án (Studio + ComfyUI GPU Worker) chỉ với 1 lệnh

Trong Terminal, chạy duy nhất lệnh:

```powershell
.\studio
```

Lệnh này tự động khởi chạy đồng thời:
1. **Giao diện Studio** tại: <http://127.0.0.1:8787> (hoặc <http://127.0.0.1:8787/studio/>)
2. **ComfyUI GPU Worker** chạy ngầm tại: <http://127.0.0.1:8188/> (tự động nhận diện `<=6GB VRAM` dùng `--lowvram --fp32-vae --force-upcast-attention`, `8–12GB VRAM` dùng `--normalvram`, hoặc fallback `--cpu` nếu PyTorch thiếu CUDA).

- **Tự động cập nhật (Hot-reload)**: Khi sửa các tệp giao diện (`studio/web/*`) hoặc mã nguồn Python (`studio/*.py`), Studio sẽ tự động cập nhật trong khi giữ nguyên tiến trình ComfyUI GPU Worker đang chạy. Bạn **không cần tắt/bật lại Terminal**, chỉ cần bấm **`F5`** tải lại trang trên trình duyệt.
- Nhấn `Ctrl+C` trong Terminal khi muốn dừng hẳn cả Studio và ComfyUI Worker.

## 3. Chế độ chọn Model trên Giao diện (`Local GPU (VRAM)` vs `Antigravity AI Bridge`)

Trên mỗi thẻ tạo ảnh/video, mở menu chọn **Model**:
- **`Local GPU (VRAM)`**: Chạy trực tiếp bằng card đồ họa của máy thông qua ComfyUI Worker và checkpoint trong `models/checkpoints`. Hệ thống tự chọn model tốt nhất phù hợp dung lượng VRAM (ưu tiên `Flux` / `SDXL` trên máy `12GB+ VRAM` và tự cấu hình `sampler`, `scheduler`, `steps`, `cfg`, `FluxGuidance` / `FluxDisableGuidance`).
- **Model Checkpoint cụ thể**: Chọn đích danh file `.safetensors` trong nhóm **LOCAL CHECKPOINTS**.
- **`Antigravity AI Bridge`**: Ghi nhiệm vụ vào hàng đợi `user/studio/bridge_queue/<run_id>.json` để phiên **Antigravity AI Agent** đọc `referencePaths` + `cleanPrompt` và trả ảnh vào `outputPath`. Nếu không có Agent xử lý hàng đợi, bấm nút **Stop (■)** ngay trên thẻ để hủy nhanh tiến trình đang chờ.

## 4. Thêm checkpoint phù hợp máy 12GB VRAM

Đặt file model checkpoint `.safetensors` vào:

```text
E:\AI\Cao\comfyui\models\checkpoints
```

- Với **máy 12GB VRAM** muốn hiểu đúng prompt dài (> 77 token) & đa nhân vật, khuyến nghị tải checkpoint All-in-One:
  - **Flux.1 Schnell FP8** (`flux1-schnell-fp8.safetensors`) từ `Comfy-Org/flux1-schnell`
  - Hoặc **SDXL / Animagine XL 3.1 / Juggernaut XL**
- Sau khi thêm model, tải lại trang Studio (hoặc chạy `.\studio doctor`) để kiểm tra.

## 5. Đổi cổng hoặc thư mục dữ liệu

Ví dụ chạy Studio ở cổng `8790`:

```powershell
.\studio --port 8790
```

Ví dụ chọn thư mục dữ liệu riêng:

```powershell
.\studio --data-dir "E:\AI\Cao\studio-data"
```

Nếu ComfyUI chạy ở máy hoặc cổng khác:

```powershell
.\studio --comfy-url "http://127.0.0.1:8188"
```

## 6. Kiểm tra dự án

Chạy bộ kiểm tra tự động của Studio:

```powershell
.\studio test
```

## Lỗi thường gặp

### Báo cổng đã được sử dụng

Một phiên Studio hoặc ComfyUI khác đang chạy. Quay lại Terminal cũ và nhấn `Ctrl+C`, hoặc chạy Studio bằng cổng khác:

```powershell
.\studio --port 8790
```

### Studio báo không kết nối được ComfyUI

Kiểm tra Terminal thứ hai có đang chạy `.\studio worker` ở cổng `8188` hay không.

### Không có model local để chọn

Kiểm tra checkpoint đã nằm trong `models\checkpoints`, sau đó khởi động lại ComfyUI worker và tải lại Studio.
