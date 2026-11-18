# Bản thiết kế giao diện Studio

Trạng thái: bản thiết kế cho các bước tiếp theo. Studio đã có canvas, cổng nối và runner ảnh cơ bản; các điều khiển trên card dưới đây chưa được triển khai đầy đủ. Magnific Spaces là tham chiếu về cách tổ chức thao tác; sản phẩm cần tên và nhận diện riêng. Bản đầu dùng nội bộ, không có đăng nhập trong ứng dụng.

## Căn cứ

- Video `C:/Users/Acer/Videos/Captures/Chibi Character Design Showcase - Spaces _ Magnific AI - Google Chrome 2026-10-26 11-15-40.mp4` cho thấy canvas, thanh công cụ, menu Thêm, bộ lọc Image/Video/Audio/3D/Utilities, Upload, Assets, nhóm node, nhóm model và Flow. Video này không trình diễn trọn một lần nối dây.
- Video `downloads/Chibi Character Design Showcase - Spaces _ Magnific AI - Google Chrome 2026-09-10 11-48-44.mp4` cho thấy ảnh nối sang Variations; node 3D có cổng `T` phía trên cổng ảnh ở cạnh trái. Những bản ghi khác trong `downloads/` cho thấy đầu ra ở cạnh phải.
- Video `C:/Users/Acer/Videos/Captures/Chibi Character Design Showcase - Spaces _ Magnific AI - Google Chrome 2026-10-26 14-46-15.mp4` cho thấy khi chọn Image Generator, card có viền xanh và thanh công cụ nổi phía trên. Prompt, số ảnh tạo, model, tỉ lệ, chất lượng và nút chạy nằm ngay trên card. Nút bánh răng mở bảng cấu hình bên phải; nút sửa prompt mở hộp thoại riêng. Cổng `T` nằm trên cổng ảnh ở ngoài cạnh trái gần đáy, cổng kết quả ảnh ở ngoài cạnh phải gần đỉnh.
- Kích thước, màu và quy tắc tương tác dưới đây là **đề xuất cho dự án**, không phải số đo hoặc mã nguồn của Magnific.

## 1. Sơ đồ sản phẩm

| Màn hình | Nội dung chính | Bản đầu |
| --- | --- | --- |
| Dự án | Danh sách workspace, ảnh đại diện, tạo/mở/đổi tên | Có |
| Studio | Canvas, thẻ media/tác vụ, cổng nối, menu Thêm, bảng cấu hình | Có |
| Tài sản | Ảnh/video nhập vào và kết quả, tìm kiếm/lọc/xem trước | Có |
| Tác vụ | Hàng đợi, đang chạy, thành công, lỗi, liên kết tới kết quả | Có |
| Mô hình | Model local đã cài, model có thể tải, tiến trình cài | Theo giai đoạn model |
| Cài đặt | API theo nhà cung cấp, thư mục lưu, trạng thái worker | Có |

Trong Studio, thanh điều hướng ứng dụng không chiếm một sidebar cố định. Nút quay lại hoặc menu ứng dụng mở `Dự án`, `Tài sản`, `Tác vụ`, `Mô hình`, `Cài đặt` để nhường diện tích cho canvas.

## 2. Bố cục Studio desktop

Mốc thiết kế là màn hình 1440 × 900; canvas đầy đủ cần tối thiểu 1024 px chiều ngang.

```text
┌──────────────────────────────────── Header 64 px ────────────────────────────────────┐
│ ← Dự án / Tên workspace    Đã lưu      1 tác vụ đang chạy       Tài sản   Cài đặt   │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─ Rail 52 px ─┐ ┌─────────────── Canvas lưới chấm ───────────────┐ ┌─ Inspector ─┐ │
│ │ + Thêm       │ │ [Ảnh] ── Ảnh ──> [Tạo ảnh] ── Ảnh ──> [Kết quả]│ │ 320–360 px │ │
│ │ ↖ Chọn       │ │              T ──>│                           │ │ khi mở ⚙    │ │
│ │ ✋ Di chuyển │ │                                              │ │ thông số    │ │
│ │ ↶ ↷          │ │                                              │ └────────────┘ │
│ └──────────────┘ └──────────────────────────────────────────────┘                │
│ Trang 1 / + Trang               Vừa graph      − 100% +      Kết nối worker     │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

- Header cao 64 px: quay lại, tên workspace có thể sửa, trạng thái lưu, tác vụ, đường vào Assets/Cài đặt. Không đặt thông số model trên header.
- Rail nổi cách mép trái khoảng 20 px: Thêm, Chọn, Bàn tay, Undo/Redo; công cụ thứ yếu trong menu mở rộng. Nút 40 × 40 px.
- Canvas chiếm phần còn lại, dot grid nhẹ theo zoom. Pan bằng Space + kéo, Bàn tay hoặc nút chuột giữa; zoom bằng cuộn trên canvas và nút dưới màn hình.
- Bảng cấu hình rộng 320–360 px, chỉ mở khi bấm bánh răng hoặc hành động tương đương trên card. Chọn card đơn thuần không mở bảng và không che các cổng nối.
- Thanh dưới luôn có Trang, Fit graph, phần trăm zoom và trạng thái kết nối.

| Thành phần | Kích thước khởi điểm |
| --- | --- |
| Thẻ tác vụ | Rộng khoảng 360–420 px, cao theo nội dung khoảng 320–460 px |
| Thẻ ảnh/video | Rộng 280–340 px; preview giữ tỉ lệ, cao tối đa 480 px |
| Thẻ văn bản | Rộng 280 px, vùng nhập tự mở rộng |
| Menu Thêm | Rộng 360–400 px, cao tối đa bằng canvas trừ 32 px |
| Khoảng giữa các thẻ | Mặc định 120 px theo hướng dây, căn lưới mềm 16 px |
| Cổng nối | Icon 28 px, vùng tương tác ít nhất 40 × 40 px |
| Dây nối | 2 px thường, 3 px khi chọn hoặc kéo |

Không ép tất cả thẻ cùng chiều cao: ảnh dọc, video ngang và prompt dài có nhu cầu khác nhau.

## 3. Hình ảnh và chữ

- Nền tối trung tính `#101114`, mặt thẻ `#1B1D22`, viền `#343840`, chữ chính `#F3F4F6`, chữ phụ `#A9AEB8`. Đây là token ban đầu, cần kiểm tra tương phản khi dựng giao diện.
- Màu nhấn riêng `#7C8CFF` cho lựa chọn và nút chính. Màu loại media chỉ là dấu phụ: text tím, ảnh lam, video lục, âm thanh hổ phách, 3D xanh ngọc. Không truyền nghĩa bằng màu đơn độc.
- Font hỗ trợ tiếng Việt tốt; chữ nội dung 14 px, tên thẻ 15–16 px, tiêu đề trang 20–24 px. Điều khiển thường dùng không thấp hơn 13 px.
- Bo góc thẻ 12 px, menu 10 px, nút 8 px. Bóng nhẹ cho panel nổi trên canvas; không dùng hiệu ứng phát sáng liên tục.
- Chuyển động 120–180 ms cho menu, chọn thẻ, tô sáng cổng; tôn trọng tùy chọn giảm chuyển động.

## 4. Menu Thêm, Upload và Assets

Mở bằng dấu `+`, phím `N` hoặc kéo dây ra vùng trống. Ô tìm kiếm được focus ngay. Bản đầu dùng bộ lọc `Tất cả / Ảnh / Video / Văn bản`; chỉ thêm bộ lọc Âm thanh, 3D và Tiện ích khi có tác vụ thật. Dùng mũi tên để chọn, Enter để thêm, Esc để đóng.

| Vị trí trong menu | Mục bản đầu | Tác dụng |
| --- | --- | --- |
| Pinned | `Assets` | Mở thư viện ảnh/video đã nhập và kết quả đã tạo; chọn tệp sẽ tạo card nguồn. |
| Media | `Upload` | Chọn tệp từ máy người dùng, lưu vào Assets, rồi đặt card nguồn tương ứng lên canvas. |
| Nodes | `Image Generator` | Tạo card sinh ảnh từ prompt, tương ứng adapter `text-image` hiện có. |
| Nodes | `Image Editor` | Tạo card sửa ảnh với input ảnh nguồn, tương ứng adapter `image-image`. |
| Nodes | `Video Generator`, `Text`, các flow video khác | `Video Generator` còn ở trạng thái thiết kế; `Text` tạo nguồn prompt. |

`Assets` chỉ xuất hiện một lần ở đầu menu; không lặp lại trong nhóm Media. Nút thư viện trên rail và mục `Assets` trong menu mở cùng một thư viện. **Không đặt `Image` nguồn cạnh `Image Generator` trong menu**: đây là lỗi của bản trước, khiến người dùng bấm ảnh nhưng nhận card upload trống. Card nguồn Image/Video vẫn tồn tại trong graph và được tạo khi Upload hoặc chọn Assets. Mỗi mục có icon, tên và mô tả một dòng. Ô tìm kiếm tìm cả `Upload`/`Assets`, loại thẻ và tên tác vụ.

```text
ADD
Search…
[All] [Image] [Video] [Text]
PINNED    Assets
MEDIA     Upload
NODES     Image Generator · Video Generator · Text · Image Editor
          Image → Video · Video → Video
```

| Đường đi | Kết quả trên canvas |
| --- | --- |
| `Add → Upload → chọn ảnh/video` | Upload xong mới tạo card nguồn ảnh/video và gắn asset mới. Nếu tệp lỗi hoặc người dùng hủy, không tạo card rỗng. |
| `Add → Assets → chọn tệp có sẵn` | Tạo card nguồn mới tham chiếu asset đã có, không sao chép tệp. |
| Card nguồn rỗng → `Upload`/`Assets` | Gắn asset vào chính card đó, không tạo card khác. |
| Card đã có tệp → `Đổi ảnh/video` | Thay tham chiếu của card; dây nối của card giữ nguyên. Tệp cũ vẫn trong Assets. |
| Kéo dây từ input ảnh/video ra vùng trống → Upload/Assets | Chỉ nhận tệp đúng loại; sau khi chọn, tạo nguồn và nối vào input đó. |

Upload dùng file picker trên thiết bị đang mở trình duyệt, kể cả khi Studio chạy trên VPS. Assets là kho tệp phía máy chạy Studio; nó chứa cả tệp upload lẫn kết quả chạy. Thư viện cần hiển thị thumbnail, tên, loại, kích thước tệp, ngày và nguồn `Đã tải lên / Đã tạo`; bộ lọc và tìm kiếm giúp chọn đúng tệp. Trong bối cảnh chọn cho một card/cổng, lọc trước theo `image` hoặc `video`. Nút tải xuống nằm trong chi tiết asset, còn hành động chọn phải rõ ràng là `Dùng trên canvas` hoặc `Dùng cho card này`.

Âm thanh và 3D chỉ xuất hiện như chức năng chạy được khi đã có backend tương ứng; không đưa mục giả vào menu bản đầu.

## 5. Thẻ và cổng nối

Thẻ có bốn vùng: (1) tên và icon ở phía trên ngoài viền card; (2) preview hoặc vùng prompt chiếm phần chính; (3) các điều khiển thường dùng và nút Chạy ở cạnh dưới trong card; (4) thanh thao tác nổi phía trên khi được chọn, gồm chạy, tạo thẻ liên quan, sửa prompt, xóa và menu thêm. Bảng cấu hình bên phải chỉ mở theo yêu cầu.

### Card nguồn ảnh/video

```text
Tên tệp hoặc “Ảnh”                               ○ Ảnh ra
┌────────────────────────────────────────────────────┐
│                                                    │
│                 Preview giữ nguyên tỉ lệ           │
│                                                    │
│  Khi trống: [Upload] [Chọn từ Assets]              │
│  Khi có tệp: [Đổi tệp]  1536 × 2752 · PNG          │
└────────────────────────────────────────────────────┘
```

Card nguồn không có cổng `T` hay input ảnh. Nó không phải card `Image Generator` trong video. Khi trống, hai hành động chọn tệp phải nhìn thấy ngay trên card. Khi đã có tệp, tên file, loại, độ phân giải ảnh hoặc thời lượng video và thao tác đổi/tải xuống xuất hiện gần preview; metadata dài nằm trong chi tiết asset. Icon output nằm ngoài mép phải gần góc trên, có khoảng hở với viền và ảnh. Chọn card chỉ hiện viền; không tự mở bảng bên phải.

### Card tạo/chỉnh ảnh

```text
                             Thanh công cụ khi chọn
Image Generator #1 hoặc Image Editor               ○ Ảnh ra
┌────────────────────────────────────────────────────┐
│                                                    │
│                 Preview kết quả gần nhất            │
│                                                    │
│  Prompt…                                           │
│  Số ảnh*    Model ▾      Tỉ lệ/kích thước ▾        │
│  Chế độ*    ⚙ Cài đặt                      ▶ Chạy  │
└────────────────────────────────────────────────────┘
  ○ T Prompt
  ○ Ảnh nguồn/tham chiếu (chỉ khi workflow hỗ trợ)

* Chỉ hiện khi adapter và model thực sự hỗ trợ.
```

Vùng preview trống có chỉ dẫn ngắn; khi chạy hiển thị trạng thái ngay tại card, khi thành công hiện ảnh mới nhất và đường vào Assets. Prompt và các lựa chọn dùng thường xuyên nằm trong card. Menu model/tỉ lệ mở cạnh nút được bấm; nút bánh răng mở bảng cấu hình dài bên phải. Nhấn vào vùng prompt có thể mở vùng soạn lớn, nhưng không cần trợ lý AI khi chưa có dịch vụ đó. Thông số `Fast/High`, số ảnh `x1/x2` và ảnh tham chiếu chỉ xuất hiện nếu adapter có khả năng và backend thực thi thật; runner hiện tại chỉ tạo một ảnh mỗi lần.

Prompt có một nguồn hiệu lực: nếu cổng `T` đã nối, card hiển thị nội dung từ thẻ Văn bản và chỉ rõ `Lấy từ thẻ Văn bản`; thao tác sửa dẫn đến đúng thẻ nguồn. Nếu chưa nối `T`, prompt nhập trực tiếp được lưu trong card tác vụ. Adapter phải dùng đúng nguồn đang hiển thị; không giữ hai prompt cùng hoạt động hoặc âm thầm ưu tiên một bên. Khi rút dây `T`, prompt nhập trực tiếp trước đó có thể hiện lại nhưng phải được ghi nhãn rõ.

| Trạng thái / thao tác | Thông tin hiện ra |
| --- | --- |
| Chưa chọn | Tên thẻ, preview, prompt ngắn, model/tỉ lệ/chất lượng hiện có, cổng nối và nút chạy. |
| Bấm vào card | Viền chọn xanh và thanh thao tác nổi phía trên. Các điều khiển trong card giữ nguyên vị trí; không tự mở bảng bên phải. |
| Bấm prompt hoặc nút sửa | Ô nhập trực tiếp cho prompt ngắn; hộp thoại soạn prompt dài là hành động riêng. Chỉ thêm trợ lý viết prompt khi dịch vụ đó thực sự có. |
| Bấm model / tỉ lệ / chất lượng | Menu chọn mở sát điều khiển tương ứng trên card và chỉ liệt kê giá trị model đang hỗ trợ. |
| Bấm bánh răng | Mở bảng bên phải với model, tham chiếu, prompt và thông số nâng cao; card vẫn nhìn thấy trên canvas. |
| Chạy | Nút ở góc dưới phải hiển thị trạng thái gửi, chờ, đang chạy, hoàn tất hoặc lỗi ngay trên card. |

Trong video 14-46-15, Image Generator có nhãn và icon nhỏ phía trên card; vùng preview trống lớn; nút `+` ở góc dưới trái vùng preview; prompt bên dưới; hàng `x1 / model / 1:1`; hàng `Fast / bánh răng / Run`. Output ảnh nằm ngoài cạnh phải phía trên, `T` và input ảnh nằm ngoài cạnh trái gần đáy. Chọn card thêm viền xanh và thanh nổi gồm Run, nối nhanh, mở Prompt editor, xóa và menu; nút Prompt editor mở hộp thoại riêng, bánh răng mở bảng model/prompt/tham chiếu bên phải. Studio hiện đã có card generator, nút Prompt editor, model, tỉ lệ thật, `x1` và Run; bảng prompt editor chỉ soạn văn bản vì chưa có trợ lý AI. `x1` là thông tin cố định vì runner local hiện tạo một ảnh; không hiện nút tăng số ảnh hay `Fast/High` khi backend chưa hỗ trợ. Tỉ lệ là lựa chọn đầu vào ánh xạ sang width/height; kích thước pixel của tệp kết quả là metadata sau khi tạo.

Đối chiếu từng đoạn của video 67 giây:

| Đoạn video | Magnific thể hiện | Studio hiện tại / việc còn cần backend |
| --- | --- | --- |
| Đầu video | `Image Generator #4` là card tạo ảnh; card chứa hình nhân vật kế bên là ảnh nguồn/kết quả riêng, chỉ có cổng ảnh ra. | Menu `Image Generator` tạo card tác vụ. `Upload`/`Assets` tạo card Image nguồn; không còn mục nguồn `Ảnh` gây nhầm. |
| Khi bấm card | Viền xanh; toolbar nổi phía trên có Run, nối nhanh, Prompt editor, Delete và menu. | Viền xanh và toolbar Run/Prompt editor/Delete; nối nhanh và menu thêm chưa có logic tương ứng. |
| Khi bấm Prompt editor | Hộp thoại lớn có vùng soạn prompt và vùng trợ lý AI riêng. | Hộp thoại soạn prompt dài, dùng đúng prompt của card hoặc thẻ Text đang nối. Vùng trợ lý AI chưa có dịch vụ để chạy thật. |
| Khi bấm `x1`, model, tỉ lệ, `Fast` | Các menu mở ngay cạnh nút trên card; video đổi số ảnh thành `x2` và mở danh sách `Fast/High`. | `x1` là thông tin một ảnh/lần chạy; checkpoint và tỉ lệ có tác dụng thật. `x2`/`Fast`/`High` cần runner/provider hỗ trợ trước khi thành nút tương tác. |
| Khi bấm bánh răng | Bảng phải có Model, References, Prompt, tỉ lệ và Run. | Bảng nâng cao có checkpoint, input, thông số và trạng thái. References kiểu Magnific cần adapter model hỗ trợ nhiều ảnh tham chiếu. |

Không suy ra rằng video chứng minh card nguồn Image trống có nút Upload: video tập trung vào card Image Generator. Card nguồn là luồng riêng của Studio để nối ảnh đã nhập vào workflow.

| Loại cổng | Icon | Nhãn ví dụ |
| --- | --- | --- |
| Text | `T` | Prompt, Negative prompt, Văn bản |
| Image | Biểu tượng ảnh | Ảnh gốc, Ảnh tham chiếu, Kết quả |
| Video | Biểu tượng phim | Video nguồn, Video kết quả |
| Audio | Sóng âm | Âm thanh, Lời thoại |
| 3D | Khối | Model 3D |

- Input ở ngoài cạnh **trái gần đáy card**, xếp dọc theo thứ tự ổn định: `T` prompt phía trên, ảnh/video tham chiếu phía dưới. Output ở ngoài cạnh **phải gần đỉnh card**, ngang vùng preview/kết quả. Để tâm icon cách mép card khoảng 20–28 px và chừa đủ khoảng cho dây; đây là khoảng cách đề xuất cho Studio, không phải số đo Magnific. Nhiều output thì xếp dọc và đặt nhãn.
- Card ảnh nguồn chỉ có cổng output ảnh. Card Text → Image hiện chỉ có input `T`; Image → Image có `T` và ảnh. Chỉ thêm cổng ảnh tham chiếu vào Text → Image khi adapter/model đã hỗ trợ ảnh tham chiếu thật.
- Hai cổng ảnh cùng thẻ phải có tên vai trò khác nhau (`Ảnh gốc`, `Ảnh tham chiếu`, `Khung đầu`, `Khung cuối`). Tên hiện khi hover/focus; có lựa chọn `Hiện tên cổng` trên canvas phức tạp.
- Khi kéo dây, cổng hợp lệ sáng rõ; cổng không hợp lệ vẫn thấy nhưng giảm nhấn. Thả sai loại hiện `Cổng này cần ảnh` hoặc thông báo tương ứng. Dây tạm đi theo con trỏ; dây đã nối có thể chọn, ngắt, nối lại, Undo/Redo.
- Kéo từ output ra canvas trống mở menu Thêm đã lọc. Tự nối sau khi thêm chỉ khi có đúng một input phù hợp.
- Không cho tạo chu trình nếu workflow không hỗ trợ. Khi chọn dây dài, làm sáng cả nguồn lẫn đích và có lệnh `Đi tới nguồn`/`Đi tới kết quả`.

| Thẻ tối thiểu | Input | Output | Trên thẻ |
| --- | --- | --- | --- |
| Văn bản | Không | Text | Ô nhập, tên |
| Ảnh đã tải | Không | Image | Preview, Upload/Assets khi trống, tên và kích thước khi có ảnh, đổi ảnh |
| Video đã tải | Không | Video | Poster, Upload/Assets khi trống, thời lượng, phát thử, đổi video |
| Tạo ảnh | Text hoặc prompt trực tiếp; ảnh tham chiếu tùy model | Image | Prompt, model, tỉ lệ/kích thước, Chạy |
| Chỉnh sửa ảnh | Image; Text hoặc prompt trực tiếp | Image | Preview, prompt, model, mức thay đổi, Chạy |
| Nâng cấp ảnh | Image | Image | Mức phóng đại/chất lượng theo model |
| Tạo video | Text; khung đầu/cuối tùy model | Video | Model, tỉ lệ, thời lượng theo model |
| Kết quả | Image hoặc Video | Cùng loại | Xem lớn, so sánh, tải, mở nơi lưu |

Chỉ hiển thị cổng và tùy chọn model thực sự hỗ trợ. Nếu đổi model làm một dây không còn hợp lệ, giao diện chỉ rõ dây bị ảnh hưởng trước khi xác nhận.

## 6. Bảng cấu hình và lựa chọn model

Bảng cấu hình mở từ bánh răng, không mở khi chỉ chọn thẻ. Nó hiện model đang chọn, đầu vào/tham chiếu đã nối, prompt đầy đủ, thông số nâng cao và trạng thái chạy. Phần đầu vào có nút thay/tách và lời nhắc cho cổng còn thiếu. Danh sách model có tìm kiếm, lọc `Local / API`, nhà cung cấp, input/output, trạng thái sẵn sàng. Phần tùy chọn chỉ hiện các trường model hỗ trợ: seed, số bước, mức thay đổi, thời lượng video, chất lượng, v.v. Giá trị thường dùng cũng phải nhìn và sửa được trực tiếp trên card.

Trước tác vụ trả phí, hiển thị nhà cung cấp và ước tính chi phí **chỉ khi có dữ liệu giá đáng tin cậy**. Nếu chưa có, ghi `Chi phí xem trên nhà cung cấp`. Thiếu API key dẫn thẳng đến ô cài đặt đúng nhà cung cấp.

## 7. Trạng thái và phản hồi

| Trạng thái | Hiển thị | Hành động |
| --- | --- | --- |
| Canvas trống | `Tải ảnh/video`, `Tạo bằng AI`, một Flow mẫu | Bắt đầu trong một bước |
| Thiếu input | Cổng bắt buộc được đánh dấu, lời nhắc ngay tại thẻ | Thêm hoặc nối nguồn |
| Thiếu model/key | Tên provider và phần thiếu | Mở đúng trang Cài đặt |
| Đang chờ/chạy | Badge, thời gian, trạng thái thật từ worker/provider | Hủy nếu backend hỗ trợ |
| Thành công | Preview lớn, liên kết Assets, nơi lưu, tác vụ tiếp | Xem, so sánh, tải, chạy tiếp |
| Lỗi | Lý do cụ thể, giữ input và dây | Sửa rồi chạy lại |
| Mất kết nối | Banner nhỏ, trạng thái cuối đã biết | Kết nối lại, không báo thành công giả |

Không hiện phần trăm giả khi provider chỉ trả `queued/running/completed`. Viết riêng lỗi key sai, hết quota, model chưa cài, tệp hỏng, hết VRAM và provider quá thời gian.

## 8. Tài sản, kết quả và lưu trữ

- Một asset là một tệp đã lưu và metadata của nó; nhiều card có thể cùng trỏ đến một asset ID. Đổi tệp trên một card không xóa asset cũ hay đổi những card khác. Xóa card chỉ xóa card và các dây của nó; xóa tệp khỏi Assets là thao tác riêng, phải xử lý các card đang tham chiếu trước.
- Assets là lưới thumbnail với bộ lọc `Ảnh / Video / Đã tải lên / Đã tạo`; chi tiết có tên, định dạng, kích thước byte, kích thước pixel hoặc thời lượng khi đọc được, nguồn, ngày tạo, dự án/tác vụ tạo ra và nơi lưu. Tệp đã tạo trở lại Assets để có thể dùng làm nguồn cho bước kế tiếp.
- Upload bằng file picker hoặc kéo thả vào canvas. Hiện tiến trình hoặc trạng thái đang nhập, kiểm tra định dạng và giới hạn tệp tại server, báo lỗi ngay tại menu/card, giữ ngữ cảnh chọn tệp sau lỗi. Bản hiện tại nhận PNG/JPEG/WebP/MP4/WebM tối đa 512 MB; UX phải nói rõ giới hạn trước khi chọn. Hủy file picker không thay đổi graph.
- Trình duyệt có thể đọc kích thước ảnh bằng `naturalWidth`/`naturalHeight` để hiện nhanh; metadata bền vững cho thư viện và API cần được ghi khi nhập hoặc tạo tệp. Không suy ra kích thước pixel từ tỷ lệ `1:1` hay dung lượng byte.
- Mỗi kết quả lưu tự động vào thư mục cấu hình tại `Cài đặt > Lưu trữ`. Chạy cục bộ có thể có `Mở thư mục`; trên VPS giao diện hiển thị đường dẫn phía server và nút tải xuống vì trình duyệt không thể mở thư mục máy chủ như thư mục máy người dùng.
- Đổi thư mục lưu chỉ áp dụng cho kết quả mới, không tự chuyển tệp cũ. Hiển thị lỗi ghi tệp và dung lượng còn lại tại nơi người dùng có thể xử lý.

## 9. Cài đặt API và model local

Mỗi nhà cung cấp có một thẻ cài đặt riêng: tên, model sử dụng, trạng thái `Chưa cấu hình / Đã lưu / Kiểm tra lỗi`, `Nhập key`, `Kiểm tra kết nối`, `Thay key`. Ô key có nhãn provider rõ; sau khi lưu chỉ hiện bốn ký tự cuối. Frontend không nhận lại toàn bộ key, không ghi key vào workflow hoặc localStorage. Mỗi preset model nói rõ nó dùng key của provider nào.

Màn hình Mô hình chia `Đã cài` và `Khám phá/tải`. Mỗi mục có loại, dung lượng, nơi lưu, yêu cầu tài nguyên và trạng thái tải. Người dùng chủ động dán URL model hoặc chọn tệp để cài; tiến trình và lỗi hiển thị tại đây. Phần tích hợp tải và API provider nằm ngoài lõi ComfyUI theo hướng dẫn của repository; không thêm lời gọi Internet vào core.

## 10. Phím tắt, trợ năng, màn hình nhỏ

| Phím | Tác vụ |
| --- | --- |
| `N` | Mở menu Thêm |
| `Space` + kéo | Di chuyển canvas |
| `Ctrl/Cmd + Z`, `Ctrl/Cmd + Shift + Z` | Hoàn tác/làm lại |
| `Delete` | Xóa phần chọn khi focus canvas |
| `F` | Vừa toàn bộ graph |
| `Esc` | Đóng menu hoặc hủy nối dây |

Không kích hoạt phím tắt canvas khi đang gõ prompt. Nút icon có tooltip và tên đọc màn hình; menu và cổng dùng được bằng bàn phím. Kiểm tra focus, độ tương phản và zoom trình duyệt 200%.

Ở 768–1023 px, bảng cấu hình thành ngăn kéo phủ bên phải, menu Thêm mở dạng panel. Dưới 768 px, ưu tiên xem dự án, Assets, kết quả và tác vụ; graph chỉ cần chỉnh sửa cơ bản trong bản đầu. Menu Add chiếm chiều ngang khả dụng, chọn Upload/Assets vẫn là một hành động rõ ràng. Không thu nhỏ toàn bộ desktop canvas khiến chữ và cổng khó chạm. Tại zoom tổng quan quá nhỏ để thao tác, cho phép xem dây nhưng yêu cầu phóng gần hơn trước khi nhập prompt hoặc kéo cổng.

## 11. Ranh giới triển khai và thứ tự thực hiện

Studio là frontend/product layer riêng. Nó lưu graph dạng thẻ dễ hiểu; adapter chuyển thành prompt/workflow cho ComfyUI. Không đưa khái niệm giao diện hoặc ID thẻ vào `execution.py` hay model loaders. Dùng API upload, prompt, history hiện có khi phù hợp. Provider bên ngoài, key, thư viện và tải model có lớp tích hợp riêng. Giữ lối mở graph ComfyUI cho trường hợp nâng cao; chỉ hứa chuyển đổi hai chiều với các thẻ adapter đã hỗ trợ.

Canvas, cổng có kiểu, upload, Assets, lưu graph và runner ảnh local đã có bản cơ bản. Đợt UI tiếp theo theo thứ tự: (1) thêm Upload/Assets vào menu Add bằng các luồng sẵn có; (2) đưa Upload/Assets vào card nguồn và hiện metadata; (3) chuyển prompt, model, kích thước và nút Chạy lên card tác vụ, chuyển bảng cấu hình thành hành động bánh răng; (4) xác định một nguồn prompt hiệu lực và giữ autosave/Undo khi sửa trực tiếp; (5) kiểm tra các trạng thái trống, đang tải, thiếu model, đang chạy, lỗi và kết quả trên card; (6) mới mở rộng adapter provider/API và các tác vụ video. Quản lý Civitai được tạm hoãn đến sau khi năm chức năng lõi chạy được. Mỗi bước cần có một luồng thực có thể trình diễn.

## 12. Tiêu chí nghiệm thu bản đầu

1. Chọn `Add → Upload`, tải ảnh, thấy card nguồn Image và mục trong Assets; thay ảnh trên card bằng `Assets` mà dây nối không đổi. Hủy hoặc tải tệp lỗi không tạo card mới. Chọn `Add → Image Generator` phải tạo card sinh ảnh, không tạo card nguồn trống.
2. Tạo card `Image Generator`, nhập prompt ngay trên card hoặc nối thẻ Text vào `T`; người dùng luôn biết prompt nào sẽ được chạy. Với `Image Editor`, nối ảnh vào cổng ảnh phía dưới `T` và phân biệt hai dây ở zoom 100%.
3. Chọn card chỉ hiện viền và thanh công cụ; bấm bánh răng mới mở bảng cấu hình. Chọn model/kích thước và chạy ngay trên card; chỉ thấy tùy chọn adapter hỗ trợ thật.
4. Tải video, dùng bộ lọc Video tìm tác vụ tương thích, xem được input bắt buộc trước khi Chạy.
5. Chọn model API và biết provider nào cần key; key đã lưu không xuất hiện trong graph, lịch sử hoặc phản hồi frontend.
6. Pan, zoom, Fit graph, nối lại dây, Undo/Redo và tìm nguồn của một kết quả mà không mất graph.
7. Thành công, lỗi và mất kết nối hiển thị đúng; kết quả quay lại Assets và có vị trí lưu hoặc cách tải phù hợp với local/VPS.
