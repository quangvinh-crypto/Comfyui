# Hướng dẫn chạy dự án

Các lệnh bên dưới được chạy trong Terminal tại thư mục gốc của dự án:

```text
E:\AI\Cao\comfyui
```

Nếu Terminal đang hiện `PS E:\AI\Cao\comfyui>`, bạn có thể dùng ngay lệnh rút gọn `.\studio`.

## 1. Chạy toàn bộ dự án (Studio + ComfyUI GPU Worker) chỉ với 1 lệnh

Trong Terminal, chạy duy nhất lệnh:

```powershell
.\studio
```

Lệnh này tự động khởi chạy đồng thời:
1. **Giao diện Studio** tại: <http://127.0.0.1:8787> (hoặc <http://127.0.0.1:8787/studio/>)
2. **ComfyUI GPU Worker** chạy ngầm tại: <http://127.0.0.1:8188/> (tự động tối ưu cờ `--lowvram --fp32-vae` cho card đồ họa VRAM thấp như GTX 1650 4GB).

- **Tự động cập nhật (Hot-reload)**: Khi sửa các tệp giao diện (`studio/web/*`) hoặc mã nguồn Python (`studio/*.py`), Studio sẽ tự động cập nhật trong khi giữ nguyên tiến trình ComfyUI GPU Worker đang chạy. Bạn **không cần tắt/bật lại Terminal**, chỉ cần bấm **`F5`** tải lại trang trên trình duyệt.
- Nhấn `Ctrl+C` trong Terminal khi muốn dừng hẳn cả Studio và ComfyUI Worker.

## 2. Chế độ chọn Model trên Giao diện (Chạy song song GPU & API)

Trên mỗi thẻ tạo ảnh/video, mở menu chọn **Model**:
- **`Local GPU (VRAM)`**: Chạy trực tiếp bằng card đồ họa của máy thông qua ComfyUI Worker và checkpoint trong `models/checkpoints`.
- **Các Model AI khác (`Antigravity AI Bridge`, `Google Nano Banana 2.1`, `Seedream 5 Pro`, `Seedance 2.0 Fast`...)**: Chạy qua luồng AI / API độc lập, có thể chạy song song cùng lúc với thẻ đang chạy bằng GPU.

## 3. Thêm checkpoint

Đặt file model checkpoint tương thích vào:

```text
E:\AI\Cao\comfyui\models\checkpoints
```

Sau khi thêm model, khởi động lại ComfyUI worker hoặc bấm tải lại danh sách model trong Studio.

## 4. Đổi cổng hoặc thư mục dữ liệu

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

## 5. Kiểm tra dự án

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
