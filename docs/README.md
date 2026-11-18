# Tài liệu dự án Studio

Đây là bộ tài liệu phân tích và thiết kế chính cho giao diện Studio xây trên ComfyUI. Mã Studio ở [`../studio/`](../studio/README.md); Text → Image và Image → Image đã có runner local nhưng chưa nghiệm thu với checkpoint thật, các hướng video vẫn là **kế hoạch**.

## Đọc theo thứ tự

| File | Trả lời câu hỏi |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Sản phẩm phục vụ ai, mục tiêu và ranh giới là gì? |
| [FUNCTIONS.md](FUNCTIONS.md) | Người dùng có thể tạo/chỉnh những loại nội dung nào? |
| [UI_BLUEPRINT.md](UI_BLUEPRINT.md) | Giao diện canvas, menu, thẻ và cổng nối hoạt động ra sao? |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Dùng lại ComfyUI thế nào; Studio cần xây những dịch vụ và nơi lưu nào? |
| [FLOW_LOGIC.md](FLOW_LOGIC.md) | Một flow được kiểm tra, chạy, theo dõi và lưu kết quả thế nào? |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Làm việc gì trước, phụ thuộc vào đâu và kiểm tra hoàn thành thế nào? |

## Phạm vi hiện tại

- Năm chức năng chính: **Text → Image, Image → Image, Image → Video, Text → Video, Video → Video**.
- Bản đầu dùng nội bộ, không có đăng nhập trong ứng dụng. Studio dùng ComfyUI làm worker và có thể bổ sung adapter API riêng theo từng model.
- **Civitai được tạm hoãn**: chưa làm tìm/tải model, nhập prompt từ ảnh Civitai hoặc tạo ảnh qua hạ tầng Civitai. Phân tích cũ trong `FUNCTIONS.md` chỉ để tham khảo khi mở lại giai đoạn đó.
- Các bản ghi tham khảo ở `../downloads/` và video Magnific được nêu trong tài liệu UI; chúng không phải mã nguồn của Studio.

## Quy tắc cập nhật

Chốt hoặc thay đổi chức năng trong `FUNCTIONS.md` trước, rồi cập nhật `UI_BLUEPRINT.md`, `ARCHITECTURE.md`, `FLOW_LOGIC.md` và `IMPLEMENTATION_PLAN.md` theo ảnh hưởng thực tế. Chọn một model/workflow chạy thật cho từng chức năng trước khi ghi là đã hỗ trợ. Giữ tài liệu ở đây làm bản chính; không tạo thêm bản nháp tương đương ở thư mục gốc.
