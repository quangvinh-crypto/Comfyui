# Danh mục chức năng của Studio

Trạng thái: bản phân tích phạm vi sản phẩm. **Năm chức năng F01–F05 là phạm vi hiện tại; toàn bộ tích hợp Civitai bên dưới được tạm hoãn.** Chức năng người dùng cần làm được xác định trước, rồi mới thiết kế thẻ, cổng nối và bộ điều phối trong [FLOW_LOGIC.md](FLOW_LOGIC.md). Một chức năng có thể có nhiều cách thực thi: model local, Comfy API proxy hoặc API riêng của nhà cung cấp. Không mặc định model nào cũng hỗ trợ mọi tùy chọn.

## 1. Năm chức năng lõi

| Mã | Chức năng | Đầu vào bắt buộc | Đầu ra | Điều khiển chính | Điều kiện để chạy |
| --- | --- | --- | --- | --- | --- |
| F01 | **Text → Image** | Prompt | Một/nhiều ảnh | Model, kích thước/tỉ lệ, số ảnh, seed nếu hỗ trợ | Model tạo ảnh và workflow/adapter phù hợp |
| F02 | **Image → Image** | Ảnh nguồn | Ảnh mới | Prompt tùy chọn, mức thay đổi, ảnh tham chiếu | Model chỉnh ảnh hoặc diffusion img2img; tùy chọn theo model |
| F03 | **Image → Video** | Ảnh đầu hoặc ảnh tham chiếu | Video | Prompt chuyển động, thời lượng, tỉ lệ, ảnh cuối nếu hỗ trợ | Model I2V hoặc API video có đầu vào ảnh |
| F04 | **Text → Video** | Prompt | Video | Thời lượng, tỉ lệ, độ phân giải, seed nếu hỗ trợ | Model T2V hoặc API video tương ứng |
| F05 | **Video → Video** | Video nguồn | Video mới | Mô tả thay đổi, mức giữ chuyển động, vùng/thời đoạn nếu hỗ trợ | Model/API V2V; cần xử lý video đầu vào, thời lượng và âm thanh |

### F01 — Text → Image

Đây là tạo mới từ nội dung chữ, không cần ảnh gốc. Các biến thể có ý nghĩa: tạo nhiều phương án, chọn tỉ lệ, dùng phong cách/nhân vật có sẵn, dùng ảnh tham chiếu tùy model. `Ảnh tham chiếu` làm đầu vào thì flow thực tế đã thành một nhánh của F02 hoặc multi-input image generation, dù giao diện vẫn có thể ghi `Tạo ảnh`. Kết quả cần lưu model, seed, prompt và thông số đủ để tạo lại khi backend hỗ trợ.

### F02 — Image → Image

Không nên gộp mọi thao tác thành một nút mơ hồ. Ít nhất cần ba chế độ hiển thị rõ: `Biến thể toàn ảnh`, `Chỉnh sửa theo prompt`, `Đổi phong cách`. Với model diffusion local, mức denoise thường quyết định ảnh mới khác ảnh gốc bao nhiêu; với API có thể không có tham số đó. Hệ thống không hiển thị thanh `Mức thay đổi` nếu provider không hỗ trợ. [Ví dụ chính thức của ComfyUI](https://docs.comfy.org/tutorials/api-nodes/stability-ai/stable-image-ultra) mô tả cả text-to-image và image-to-image, trong đó image denoise điều khiển mức thay đổi.

### F03 — Image → Video

Các chế độ sản phẩm khác nhau: `Ảnh đầu → video`, `Ảnh đầu + ảnh cuối → video`, `Ảnh tham chiếu nhân vật/phong cách → video`. Phải phân biệt vai trò của từng ảnh; không để nhiều cổng ảnh không tên. Preview cần hiện ảnh nguồn, video đầu ra và thời lượng. Trong mã hiện có có các node ByteDance Image to Video, First-Last-Frame và Seedance Reference to Video, nhưng các node API hiện có đi qua Comfy proxy; dùng API key riêng cần adapter khác.

### F04 — Text → Video

Tạo clip từ prompt. Các tham số như thời lượng, độ phân giải, tỉ lệ, âm thanh, camera, seed phụ thuộc model. Tác vụ thường bất đồng bộ; UI cần lưu job ID, cập nhật trạng thái thật và lấy file khi hoàn thành. Có thể nối F04 → F05 để làm tiếp; không ghép nhiều clip mặc nhiên thành một video dài.

### F05 — Video → Video

Tên này bao gồm nhiều hành vi rất khác nhau. Bản đầu nên ghi rõ `Biến đổi video theo prompt` và chỉ mở khi có model/API đã kiểm thử. Các biến thể về sau: đổi phong cách mà giữ chuyển động, sửa vật thể/nhân vật, thay nền, áp chuyển động từ video tham chiếu, cải thiện chất lượng. Khác F03 vì video nguồn gồm nhiều khung hình và có thể có audio; logic phải xác định có giữ, bỏ hay tái tạo audio. `Cắt video`, `nâng độ phân giải` và `nội suy khung hình` là công cụ video riêng, không phải cùng một hành động V2V.

## 2. Các chức năng ảnh nên bổ sung

| Mã | Tên hiển thị | Đầu vào → đầu ra | Giá trị cho người dùng | Điều kiện kỹ thuật | Ưu tiên |
| --- | --- | --- | --- | --- | --- |
| I01 | **Sửa vùng ảnh (inpaint)** | Ảnh + mask + prompt → ảnh | Thay/quét vật thể, sửa mặt/tay, đổi trang phục ở vùng chọn | Công cụ vẽ mask và model hỗ trợ mask | P1 |
| I02 | **Mở rộng khung hình (outpaint)** | Ảnh + vùng mở rộng/prompt → ảnh lớn hơn | Đổi ảnh vuông thành ngang/dọc, thêm bối cảnh | Padding + mask + model phù hợp | P1 |
| I03 | **Nâng cấp ảnh (upscale)** | Ảnh → ảnh lớn hơn | Tăng kích thước và chi tiết | Upscaler local/API; phân biệt resize thường với AI upscale | P1 |
| I04 | **Xóa/thay nền** | Ảnh + prompt/nền mới tùy chọn → ảnh/mask | Ảnh sản phẩm, chân dung, sticker | Segmentation/matting, ghép alpha; generative fill nếu thay nền | P1 |
| I05 | **Tạo biến thể** | Ảnh/prompt → nhiều ảnh | Chọn nhiều phương án từ một ý tưởng | Nhiều seed hoặc model variation | P1 |
| I06 | **Ghép nhiều ảnh tham chiếu** | Nhiều ảnh + prompt → ảnh | Kết hợp nhân vật, trang phục, bố cục | Model hỗ trợ multi-image; kiểm soát vai trò từng ảnh | P1/P2 |
| I07 | **Giữ nhân vật/phong cách** | Ảnh tham chiếu hoặc LoRA + prompt → ảnh | Tạo bộ ảnh nhất quán | Model/LoRA/reference method phù hợp; không bảo đảm tuyệt đối | P2 |
| I08 | **Điều khiển bố cục/tư thế** | Ảnh pose/depth/edge + prompt → ảnh | Giữ dáng, đường nét, phối cảnh | ControlNet hoặc cơ chế tương đương đúng base model | P2 |
| I09 | **Khôi phục ảnh** | Ảnh → ảnh phục hồi | Giảm nhiễu, sửa nét/mặt, phục hồi ảnh cũ | Model restoration phù hợp; rủi ro thay đổi chi tiết gốc | P2 |
| I10 | **Xử lý hàng loạt** | Nhiều ảnh + cùng thiết lập → nhiều ảnh | Áp một tác vụ cho cả thư mục/bộ ảnh | Queue, tên file, giới hạn đồng thời, retry từng mục | P2 |

[Tài liệu ComfyUI về inpainting](https://docs.comfy.org/tutorials/api-nodes/openai/gpt-image-1) thể hiện rõ đầu vào ảnh + mask + prompt. Các chức năng I01/I02 không chỉ là nút chọn model; chúng đòi hỏi công cụ vẽ vùng và quản lý kích thước ảnh ở giao diện.

## 3. Các chức năng video nên bổ sung

| Mã | Tên hiển thị | Đầu vào → đầu ra | Phân biệt với năm chức năng lõi | Ưu tiên |
| --- | --- | --- | --- | --- |
| V01 | **Ảnh đầu + ảnh cuối → video** | 2 ảnh + prompt → video | Biến thể có ràng buộc của F03; UI có hai cổng ảnh riêng | P1 |
| V02 | **Kéo dài video** | Video + prompt/ảnh cuối → video dài hơn | Tiếp nối thời gian, khác tạo lại toàn clip | P2 |
| V03 | **Nâng cấp video** | Video → video độ phân giải/chất lượng cao hơn | Cải thiện độ nét; không yêu cầu đổi nội dung | P2 |
| V04 | **Tăng FPS/nội suy** | Video → video nhiều khung hình hơn | Làm mượt chuyển động; không phải sinh cảnh mới | P2 |
| V05 | **Cắt/ghép/đổi khung** | Video → video | Công cụ dựng video xác định, không phải AI generation | P1 |
| V06 | **Tách khung hình** | Video → tập ảnh | Làm ảnh tham chiếu, chọn keyframe hoặc chỉnh một khung | P1 |
| V07 | **Áp chuyển động từ video tham chiếu** | Ảnh nhân vật + video chuyển động → video | V2V/animation có vai trò input riêng | P2 |
| V08 | **Tạo clip theo loạt cảnh** | Danh sách prompt/ảnh → nhiều clip | Orchestrate nhiều F03/F04 rồi ghép; cần quản lý liên tục nhân vật | P3 |

Trong repo đã có node Load/SaveVideo, Trim/Crop/VideoSlice, một số workflow video local (Wan, Hunyuan, v.v.) và các node API ByteDance. Điều đó cho thấy đường tích hợp có thể khảo sát, **không** có nghĩa mọi workflow sẽ chạy được trên GTX 1650 4 GB. Cần kiểm tra VRAM, bộ nhớ hệ thống, định dạng và tốc độ của từng model trước khi đưa vào danh mục `Sẵn sàng`.

## 4. Chức năng khác có thể có, nhưng không chen vào lõi ảnh/video

| Nhóm | Ví dụ | Khi nào đưa vào |
| --- | --- | --- |
| Image/Video → Text | Mô tả ảnh, tạo caption, trích prompt, tóm tắt video | Khi có model thị giác và nhu cầu tìm kiếm tài sản bằng nội dung |
| Text → Audio | Giọng đọc, nhạc, hiệu ứng âm thanh | Khi làm video có âm thanh thực sự và chọn được provider/model |
| Audio → Text | Chép lời, phụ đề | Khi có quy trình dựng video và định dạng subtitle |
| Image/Text → 3D | Tạo mô hình 3D | Sản phẩm mở sang thiết kế 3D; cần preview/export riêng |
| Công cụ chuẩn | Resize, crop, chuyển định dạng, mask, trộn ảnh/video | Làm nền cho các tác vụ AI, có thể chạy local không cần model lớn |

Những mục này là **khả năng mở rộng**, không nên xuất hiện như tính năng hoàn chỉnh trong menu bản đầu. ComfyUI có các node audio và 3D, nhưng sản phẩm cần workflow, preview, export và model/adapter tương ứng trước khi công bố.

## 5. Civitai làm dự án mạnh hơn ở đâu?

Cần phân biệt **Civitai Site API** để tìm/tải tài nguyên với **Civitai Orchestration API** để chạy tác vụ trên hạ tầng của Civitai. Chỉ tích hợp tìm/tải model **không** tự cung cấp GPU, API video hay tất cả các chức năng sinh nội dung. [Tài liệu Civitai](https://github.com/civitai/civitai-developer-docs/blob/main/site/index.md) nêu rõ hai bề mặt này khác nhau.

### Dùng prompt từ ảnh Civitai mà không tải checkpoint

Site API có thể tra ảnh theo `imageId` với `withMeta=true`, lấy prompt, negative prompt, seed, steps, sampler, CFG, kích thước và ID tài nguyên nếu người đăng có cung cấp metadata. Studio nên có hành động `Nhập từ liên kết Civitai`: xem trước ảnh + thông số; cho chọn `Chỉ sao chép prompt`, `Tạo tương tự bằng model khác`, hoặc `Tạo gần bản gốc bằng tài nguyên tương ứng`. Dữ liệu thiếu phải hiện là `Không có`, không tự suy đoán.

Ví dụ ảnh `146160739` trong ảnh chụp của người dùng: API trả model version `3060999` (`Krea2 Turbo_FP8`, base `Krea 2 Turbo`), prompt và negative prompt, seed `3434683905`, steps `8`, CFG `1`, sampler `Euler a`, kích thước `720 × 1280`, cùng metadata của lượt high-resolution. Endpoint phiên bản tối giản báo `canGenerate=true` và AIR `urn:air:krea2:checkpoint:civitai:2723583@3060999`. Điều này cho thấy có đường **đề nghị chạy trên Civitai Orchestration** mà không tải trọng số về máy; trước khi bật nút Chạy phải kiểm tra tài khoản/token, quyền dùng phiên bản, khả năng biểu diễn các thông số gốc và ước tính Buzz. Chưa có lần tạo ảnh thử, nên chưa khẳng định ảnh tái tạo sẽ giống hệt.

Mức kỳ vọng: chỉ prompt → cùng chủ đề/phong cách; thêm đúng checkpoint/phiên bản → gần phong cách hơn; thêm negative prompt, seed, sampler, CFG, steps, kích thước, VAE/encoder, lượt upscale và cùng pipeline → có thể gần bố cục/chi tiết hơn. Kể cả cùng seed, backend hoặc phiên bản khác có thể cho kết quả khác. Nếu mục tiêu là giữ bố cục/nhân vật gần ảnh mẫu, chọn một chế độ Image → Image dùng ảnh tham chiếu khi model/API hỗ trợ.

`Krea2 Turbo_FP8` trong ví dụ có file model khoảng 12.6 GB theo Model Versions API, vượt xa VRAM 4 GB của máy hiện tại. Do đó đường cloud phù hợp để thử ảnh này hơn đường local; vẫn cần kiểm tra giá và khả năng hỗ trợ phiên bản cụ thể. Không nhầm công thức Krea v2 qua FAL với chính checkpoint Krea2 Turbo FP8 của ảnh mẫu: hai đường đó có tham số khác nhau.

| Tài nguyên Civitai | Tác dụng thực tế trong Studio | Chức năng được mở rộng | Điều kiện tương thích |
| --- | --- | --- | --- |
| **Checkpoint / diffusion model** | Chọn mô hình nền và chất lượng/phong cách sinh | F01, F02, I01/I02 nếu workflow/model hỗ trợ | Đúng kiến trúc, encoder, VAE, VRAM và license |
| **LoRA** | Thêm nhân vật, phong cách, trang phục, sản phẩm hoặc hiệu ứng | F01, F02, I07; đôi khi video nếu đúng hệ model | Phải khớp base model và có loader/workflow phù hợp |
| **Textual inversion / embedding** | Từ khóa/điều kiện bổ sung cho prompt | F01/F02 ở các hệ hỗ trợ | Đúng text encoder và base model |
| **ControlNet / control model** | Giữ pose, depth, edge, cấu trúc | I08 và các nhánh F02 | Cần preprocessor/ảnh điều kiện và đúng họ model |
| **VAE** | Cải thiện cách mã hóa/giải mã màu và chi tiết | Chất lượng đầu ra của workflow tương thích | Đúng họ model/latent; không phải chức năng độc lập |
| **Upscaler model** | Tăng độ phân giải bằng AI | I03, một số bước hoàn thiện ảnh/video | Loader/định dạng được hỗ trợ; video cần chạy từng frame hoặc model video riêng |
| **Model video/LoRA video** | Phong cách hoặc khả năng tạo/chỉnh clip | F03–F05, V01–V08 tùy model | Phụ thuộc kiến trúc, workflow, GPU/API; không suy từ nhãn Civitai |

Các loại tài nguyên, phiên bản, base model, file, hash và URL tải được Civitai công bố qua [Models API](https://github.com/civitai/civitai-developer-docs/blob/main/site/reference/models.md) và [Model Versions API](https://github.com/civitai/civitai-developer-docs/blob/main/site/reference/model-versions.md). ComfyUI hiện có thư mục `models/checkpoints`, `models/loras`, `models/controlnet`, `models/vae`, `models/upscale_models`, `models/embeddings`, cùng các loader tương ứng trong repo. Civitai **không phải nơi tải custom node Python nói chung**; custom node là một luồng cài phần mềm riêng, cần kiểm tra nguồn, phụ thuộc và quyền thực thi.

### Chức năng quản lý Civitai cần có

1. Tìm bằng tên, loại model, base model; xem preview, phiên bản, dung lượng, định dạng, quyền sử dụng và yêu cầu phần cứng.
2. Chọn **đúng file/phiên bản**; kiểm tra format, hash, base model, tương thích với loader và chỗ trống ổ đĩa trước khi tải.
3. Tải do người dùng chủ động yêu cầu; hiển thị tiến trình, lỗi, khả năng tiếp tục nếu được hỗ trợ. Đặt file vào thư mục ComfyUI phù hợp hoặc đường dẫn model bổ sung được cấu hình; metadata nằm trong database.
4. Quét model đã cài, nhận dạng bằng hash, phát hiện trùng, cho biết model nào dùng được trong chức năng nào. Không hiện model là `Sẵn sàng` chỉ vì tệp tồn tại.
5. Khi chọn LoRA/ControlNet, lọc theo checkpoint/base model và workflow đang chọn; báo rõ sự không tương thích. Cho gỡ khỏi danh mục và xóa file qua thao tác tường minh.
6. Hiển thị giấy phép/điều kiện thương mại của **cả base model và tài nguyên bổ sung** trước khi sau này mở bán. Metadata Civitai có trường quyền thương mại; quyền sử dụng không giống nhau cho mọi model.

## 6. Ma trận chức năng → logic cần xây

| Nhóm chức năng | Input UI mới | Logic xử lý | Output |
| --- | --- | --- | --- |
| F01/F04 tạo từ text | Prompt và chọn model | Adapter local/API, job bất đồng bộ với video | Image/Video asset |
| F02/I01/I02 chỉnh ảnh | Ảnh, prompt, mask/khung mở rộng | Lưu ảnh/mask, resize chỉ khi model cần, workflow riêng | Image asset + so sánh trước/sau |
| F03/V01 ảnh sang video | Ảnh đầu, ảnh cuối/tham chiếu, prompt | Kiểm tra vai trò ảnh, tải media lên đúng provider, poll task | Video asset + poster |
| F05/V02/V07 video sang video | Video, prompt, tham chiếu tùy chế độ | Đọc thời lượng/FPS/audio, chọn model hỗ trợ, giữ hoặc bỏ audio theo tùy chọn | Video asset + thông tin audio |
| I03/V03/V04 nâng cấp | Ảnh/video | Chọn upscaler/interpolator; với video quản lý frame và ghép lại | Asset có thông số mới |
| Civitai local | Model/version/file | Tải, kiểm tra hash, cài đúng thư mục, quét capability | Model khả dụng trong catalog |

Logic chung vẫn gồm graph, kiểm tra dây, snapshot lần chạy, hàng đợi, trạng thái, lưu kết quả. **Logic chuyên biệt** được quyết định bởi từng chức năng: mask editor cho inpaint, timeline cho video, nhiều ảnh có vai trò cho I2V, bộ chọn LoRA/ControlNet cho local generation. Vì vậy không nên thiết kế một node `AI Generator` nhận mọi loại đầu vào và mọi tham số.

## 7. Thứ tự chức năng đề xuất

- **Giai đoạn A — năm chức năng chính:** F01–F05 đều có mặt như mục tiêu sản phẩm. Mỗi chức năng chỉ được đánh dấu `Đã hỗ trợ` sau khi có ít nhất một model/adapter chạy thật. Ưu tiên triển khai F01/F02 trước để kiểm tra graph và lưu ảnh; F03/F04 sau vì video có job dài; F05 cuối giai đoạn vì input video, audio và khả năng model phức tạp hơn.
- **Giai đoạn B — chỉnh sửa hữu ích:** I01–I05 và V01, V05, V06. Đây là phần tạo cảm giác công cụ đầy đủ hơn một hộp prompt.
- **Giai đoạn C — cá nhân hóa bằng Civitai:** tìm/tải checkpoint, LoRA, upscaler, ControlNet; thêm I06–I10 khi đã có model tương thích. Bắt đầu bằng một họ model local được kiểm thử thay vì nhận mọi file.
- **Giai đoạn D — video nâng cao và đa phương tiện:** V02–V04, V07–V08, audio và 3D nếu có nhu cầu thật và tài nguyên chạy được.

Trên máy hiện tại (GTX 1650 4 GB, RAM 16 GB), catalog cần hiển thị `Local khả dụng / Cần GPU mạnh hơn / Dùng API` theo kiểm thử thực tế. Không khẳng định mọi checkpoint trên Civitai đều chạy được; model video lớn đặc biệt dễ vượt tài nguyên. VPS thường không kèm GPU, nên nếu chuyển lên VPS CPU-only, những tác vụ GPU nặng vẫn cần worker GPU hoặc provider API.

## 8. Quyết định còn phải chốt trước khi viết runner

1. Với mỗi F01–F05, chọn **một model/adapter đầu tiên** và xác nhận đầu vào, đầu ra, giới hạn thực, key/chi phí và nơi chạy.
2. Chốt định dạng media chuẩn trong Studio: ảnh (kèm alpha/mask), video (container/codec/FPS/audio), text; cổng trên canvas theo các loại này.
3. Chốt F05 bản đầu là `biến đổi video theo prompt` bằng model nào; không dùng tên chung cho ba cơ chế V2V khác nhau.
4. Civitai được tạm hoãn; quyết định họ model Civitai chỉ cần khi bắt đầu giai đoạn tích hợp đó.
5. Chốt có cần audio giữ nguyên khi xử lý video hay không; đây là hành vi thấy ngay ở đầu ra, ảnh hưởng đến pipeline và lưu trữ.
