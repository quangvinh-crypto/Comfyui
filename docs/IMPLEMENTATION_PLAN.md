# Kế hoạch triển khai Studio

Trạng thái: **giai đoạn 1–2 đã có; giai đoạn 3–5 đang kiểm thử**. Studio lưu flow/media, cho chọn thư mục kết quả mới, có runner Text → Image và Image → Image local gửi `/prompt`, đọc `/queue`/`/history`, lưu output vào Assets và tiếp tục theo dõi sau restart. Image → Image upload ảnh nguồn qua API ComfyUI. Các đường chạy đã qua kiểm thử với worker giả lập; máy chưa có checkpoint nên F01/F02 **chưa đạt nghiệm thu bằng model thật**. `ARCHITECTURE.md` và `FLOW_LOGIC.md` giải thích thiết kế, còn tài liệu này xác định thứ tự làm và tiêu chí hoàn thành. Phạm vi hiện tại gồm F01–F05 trong `FUNCTIONS.md`. Civitai được tạm hoãn.

## Nguyên tắc thực hiện

- Mỗi giai đoạn phải tạo ra một luồng có thể kiểm tra, không chỉ hoàn thành màn hình tĩnh hoặc API rời rạc.
- Dùng API/node ComfyUI hiện có; chỉ sửa core khi có một lỗi cụ thể không giải quyết được ở lớp Studio hoặc adapter.
- Một chức năng chỉ được đánh dấu `Đã hỗ trợ` khi có **ít nhất một** model/workflow chạy thật, output được lưu và các lỗi chính được xử lý. Model khác là công việc bổ sung.
- Phân biệt ba đường chạy: local ComfyUI, Comfy API proxy, API key trực tiếp của provider. Không tự đổi đường chạy khi có khả năng phát sinh phí.
- Không ấn định ngày hoàn thành hoặc chi phí trước khi kiểm thử model/API và tài nguyên máy. Bảng dưới dùng tiêu chí nghiệm thu để đo tiến độ.

## Bảng kế hoạch

| Giai đoạn | Công việc | Đầu ra kiểm tra được | Phụ thuộc / quyết định cần chốt |
| --- | --- | --- | --- |
| **0. Khảo sát kỹ thuật** | Chạy ComfyUI hiện tại; xác nhận API, node và khả năng máy; chọn một ứng viên cho từng F01–F05 | Bảng model/adapter có input, output, nơi chạy, key, giới hạn và kết quả thử nhỏ | Với F05 phải định nghĩa phép V2V đầu tiên; với API phải chọn proxy hay BYOK |
| **1. Khung Studio** | Tạo frontend riêng, trang Dự án và Studio, canvas, thẻ `T`/ảnh/video, menu Thêm | Tạo thẻ, kéo nối, zoom/pan, lưu và mở lại flow sau reload | Chỉ cần catalog chức năng cơ bản; chưa cần GPU |
| **2. Dữ liệu và media** | Studio API, SQLite riêng, upload ảnh/video, asset store, preview, nơi lưu kết quả | Tải ảnh/video vào, xem ở Assets, reload/restart vẫn còn; path được kiểm tra | Chốt định dạng nhận và thư mục lưu mặc định |
| **3. Runner ComfyUI** | Kiểm tra graph, biên dịch preset local, gửi `/prompt`, nghe `/ws`, đối chiếu `/history`, mapping run/step | Một tác vụ local chạy, trạng thái/lỗi đúng thẻ, output lưu vào Assets | Workflow local đầu tiên đã thử ở giai đoạn 0 |
| **4. F01 Text → Image** | Prompt card, tham số đúng model, một preset tạo ảnh | `T → Tạo ảnh → Kết quả`; tạo lại trang vẫn thấy prompt, model, kết quả | Chọn một model local hoặc API chạy được |
| **5. F02 Image → Image** | Cổng ảnh nguồn, chế độ biến thể/chỉnh prompt đầu tiên, so sánh trước/sau | `Ảnh → Chỉnh ảnh → Kết quả`; biết ảnh nguồn và mức thay đổi nếu backend hỗ trợ | Chọn một model chỉnh ảnh; không giả định mọi model có denoise |
| **6. Provider và secret** | Cấu hình provider riêng, lưu key phía server, adapter đầu tiên, polling/cost indication | Key không lộ trong graph/history; lỗi key/quota rõ; job API có thể khôi phục trạng thái | Chốt provider đầu tiên và đường BYOK/proxy; làm trước giai đoạn video nếu video dùng API |
| **7. Nền video** | Upload/preview video, đọc duration/FPS/audio, lưu poster và output, hủy/timeout job dài | Một video vào/ra được lưu, phát lại và tải về; trạng thái sau reconnect đúng | Chốt định dạng/codec và quy tắc giữ âm thanh |
| **8. F03 Image → Video** | Ảnh đầu; thêm ảnh cuối/tham chiếu chỉ khi preset hỗ trợ; prompt chuyển động | `Ảnh → Tạo video → Kết quả`; cổng ảnh có vai trò rõ | Một I2V model/API đã thử, giới hạn ảnh/video rõ |
| **9. F04 Text → Video** | Prompt, duration/tỉ lệ theo model, job bất đồng bộ | `T → Tạo video → Kết quả`; không hiện tiến độ giả | Một T2V model/API đã thử |
| **10. F05 Video → Video** | Một hành vi V2V đã định nghĩa, input video, prompt/tùy chọn thật của model | `Video → Biến đổi video → Kết quả`; kiểm tra audio, FPS và độ dài | Chọn model V2V; thử mẫu ngắn trước |
| **11. Hoàn thiện và triển khai** | Retry/hủy, phục hồi sau restart, thông báo lỗi, backup DB/file, cấu hình local/VPS, kiểm tra UX | F01–F05 mỗi chức năng chạy thật; backup/restore và truy cập VPS nội bộ thử thành công | Hạ tầng GPU/API để chạy các preset đã chọn |

Giai đoạn 4–5 có thể đổi thứ tự theo model khả dụng; giai đoạn 6 có thể tiến hành song song với giai đoạn 3 nếu chức năng đầu tiên chọn API. Không bỏ qua nghiệm thu của giai đoạn 2–3 trước khi xây nhiều chế độ video.

## Quyết định kỹ thuật cần ghi ở giai đoạn 0

| Chức năng | Ứng viên cần chọn | Thông tin phải ghi trước khi viết adapter |
| --- | --- | --- |
| F01 Text → Image | Một workflow ComfyUI local **hoặc** một provider ảnh | Model/version, prompt input, size/aspect, seed, output, VRAM hoặc key/chi phí |
| F02 Image → Image | Một workflow img2img/edit | Ảnh/mask/reference, mức thay đổi thực, output, giới hạn ảnh |
| F03 Image → Video | Một I2V model/API | Vai trò ảnh đầu/cuối, kích thước, thời lượng, trạng thái job, chi phí |
| F04 Text → Video | Một T2V model/API | Prompt, duration, resolution, audio, trạng thái job, chi phí |
| F05 Video → Video | Một model/API V2V cụ thể | Phép biến đổi, duration/FPS/codec input, audio output, key/chi phí |

Các dòng này là **đầu việc chọn và kiểm thử**, không phải lý do hoãn cả dự án. Có thể triển khai giai đoạn 1–3 trong khi khảo sát những adapter video.

## Điểm nghiệm thu toàn dự án

1. Cả năm hướng F01–F05 có ít nhất một preset hoạt động trên backend được cấu hình, với đầu vào/đầu ra đúng loại và thông số không gây hiểu nhầm.
2. Graph lưu được và mở lại đúng; thay input đánh dấu kết quả phụ thuộc đã cũ. Người dùng thấy nguồn và kết quả tương ứng trên canvas.
3. File ảnh/video được lưu ở nơi cấu hình; Assets và lịch sử giữ được sau restart. Có tải xuống phù hợp khi chạy trên VPS.
4. Queue, hủy, lỗi và retry hoạt động theo đúng khả năng backend; không gọi lại API trả phí âm thầm sau restart.
5. Key không xuất hiện trong frontend response, graph, log hoặc lịch sử; worker ComfyUI không phơi trực tiếp ra Internet khi triển khai VPS.

## Ngoài phạm vi bản triển khai này

Civitai, cài custom node tự động, đăng ký tài khoản, bán credit, cộng tác nhiều người, audio/3D và các chức năng ảnh/video nâng cao trong phần P1–P3 của `FUNCTIONS.md`. Chỉ đưa một mục trở lại kế hoạch khi năm hướng chính đã hoạt động hoặc khi người dùng thay đổi ưu tiên.
