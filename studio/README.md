# Studio

Từ thư mục gốc của dự án, chạy:

```powershell
.\studio
```

Mở `http://127.0.0.1:8787/studio/`. Server tự động cập nhật khi sửa file trong `studio/` (chỉ cần bấm `F5` tải lại trang trên trình duyệt). Có thể đổi `--host`, `--port` và `--data-dir`; mặc định server chỉ nghe trên máy cục bộ và lưu dự án ở `user/studio/studio.db`.

Hiện có trang dự án, canvas, menu node, cổng `T`/ảnh/video, kiểm tra dây nối, kéo thẻ, zoom/pan, hoàn tác/làm lại và tự lưu flow. Menu **Thêm** có **Image Generator**, **Image Editor**, **Upload** và **Assets**. Image Generator là card tạo ảnh từ prompt; Upload/Assets tạo card ảnh hoặc video nguồn. Card nguồn có nút thay tệp ngay trên canvas. Studio nhận PNG/JPEG/WebP/MP4/WebM (tối đa 512 MB mỗi tệp). File nhập nằm ở `<data-dir>/assets/`, metadata nằm trong `studio.db`. Trình duyệt có thể xem và tải tệp về.

Thẻ **Image Generator** (`text-image`) và **Image Editor** (`image-image`) có workflow checkpoint cơ bản cho ComfyUI local. Chạy ComfyUI ở `http://127.0.0.1:8188` hoặc đặt `--comfy-url` khi khởi động Studio, rồi đặt một checkpoint hoàn chỉnh trong `models/checkpoints`. Prompt, model, tỉ lệ hoặc mức thay đổi và nút **Run** nằm ngay trên card; nút bánh răng mở thông số nâng cao. Nút `+` mở Prompt editor. Prompt có thể nhập trực tiếp trên card; nếu nối cổng `T`, nội dung từ thẻ Text là prompt được chạy. Image Editor cần ảnh nguồn và chuyển ảnh qua API upload của ComfyUI trước khi chạy. Studio lưu trạng thái job trong SQLite, đọc `/queue` và `/history`, rồi sao chép ảnh kết quả vào kho asset. Workflow dùng `SaveImage`, nên ảnh cũng còn trong thư mục output của ComfyUI.

Nút **Nơi lưu kết quả** trên thanh công cụ cho phép nhập đường dẫn tuyệt đối của một thư mục đã có trên máy chạy Studio. Thiết lập này áp dụng cho lần chạy mới; mỗi job ghi nhớ thư mục đã chọn khi bắt đầu. File cũ vẫn ở vị trí cũ và tiếp tục xem/tải được trong thư viện. Nếu không chọn, kết quả nằm ở `<data-dir>/assets/`.

Máy hiện chưa có checkpoint trong `models/checkpoints`, vì vậy hai đường chạy ảnh đã được kiểm thử bằng worker giả lập nhưng **chưa kiểm thử tạo ảnh bằng model thật**. Các thẻ video vẫn chỉ thiết kế flow. Chưa có adapter provider/API key hoặc xóa asset khỏi thư viện.

Kiểm tra API:

```powershell
.\venv\Scripts\python.exe -m unittest studio.test_app -v
```

Khi triển khai VPS, cần đặt Studio sau một lớp truy cập nội bộ (VPN hoặc reverse proxy có xác thực); bản này chưa có đăng nhập và không nên bind trực tiếp ra Internet.
