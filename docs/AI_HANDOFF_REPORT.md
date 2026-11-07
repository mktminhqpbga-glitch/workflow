# BÁO CÁO BÀN GIAO CHO AI — MUSEFLOW / WORKFLOW

**Cập nhật:** 2026-11-08  
**Mục đích:** AI lập trình khác đọc trước khi sửa UI, node, Canvas, kết nối, và xử lý các nhiệm vụ/lỗi chưa xong.  
**Nguồn yêu cầu:** Các quyết định của chủ dự án trong phiên thiết kế MuseFlow V3.  
**Repo được kiểm tra:** mktminhqpbga-glitch/workflow, nhánh main, version 0.31.0 tại thời điểm soạn.

> QUAN TRỌNG: **Repo GitHub hiện đang là Workflow · MuseFlow 0.31.0**, có cả extension Chrome/Edge và Electron desktop. Các bản MuseFlow **V2/V3** và ảnh chụp thử trước đó được chỉnh trong một môi trường làm việc khác, **không được coi là đã merge lên GitHub**. Không suy diễn “đã làm xong” từ các lời mô tả trong chat. Trước mỗi thay đổi phải kiểm tra HEAD/mã/test hiện tại và đối chiếu thiết kế.

## 1. Hướng dẫn cho AI tiếp theo

1. Đọc tài liệu này, README.md, docs/APP-ARCHITECTURE.md và docs/PROGRESS.md trước khi sửa.
2. Mở mã thật để kiểm tra trạng thái trước khi đánh dấu nhiệm vụ xong. Mỗi lỗi phải có cách tái hiện, bằng chứng, sửa và bài thử hồi quy.
3. Không xóa logic cũ hoặc phá workflow đã lưu chỉ để làm giống giao diện mới. Có thể **ẩn loại node cũ khỏi menu thêm mới** nhưng cần giữ khả năng đọc/chạy/tái xuất các workflow cũ, hoặc có quy trình migration rõ ràng.
4. **Giao diện và chức năng là hai trạng thái độc lập**. Nhận ảnh mẫu ≠ đã code UI; code UI ≠ đã kết nối AI; mock/simulation ≠ xác nhận dịch vụ AI thật.
5. Không tự gán hành vi cho các nút chưa xác định; ghi câu hỏi tại mục 8 và đợi chủ dự án xác nhận.
6. Ưu tiên chỉnh **Node thật trên Canvas**; không tạo gallery minh họa rồi gọi là đã sửa ứng dụng.
7. Chạy các kiểm thử có thể thực hiện được, ghi rõ kiểm thử nào chưa chạy (đặc biệt macOS, tài khoản/phiên đăng nhập AI thật).
8. Cập nhật bảng nhiệm vụ và nhật ký lỗi bên dưới sau mỗi đợt sửa; ghi commit/PR, file bị sửa, kết quả test và còn thiếu gì. Không tự nhận sẽ làm việc ngầm khi chưa có tác vụ đang chạy.

## 2. Giao diện tổng thể đã được chủ dự án chốt về MẶT THIẾT KẾ

- **A — Header nổi:** nền tối, nhãn tiếng Việt. Logo mở menu dự án; tên dự án sửa được; tên workflow mở danh sách workflow đã lưu; có tải workflow .json; nút chia sẻ prompt tổng mở modal giữa màn hình, có nút sao chép góc phải và nút đóng; nút chạy/dừng; avatar mở **Cài đặt giao diện** (sáng/tối và màu nhấn toàn app), tách riêng **Cài đặt hệ thống/AI**. Mục A10/ba chấm chưa chốt nhiệm vụ.
- **B — Trạng thái:** giữ thành phần và hành vi, **bỏ nền riêng**, hòa với Canvas.
- **C — Canvas:** nền tối lưới chấm; dãy tạo nhanh gồm Ảnh, Video, Âm thanh AI, Kịch bản; **bỏ ô “Chỉnh sửa thông minh” ở dãy tạo nhanh** (nhưng node Chỉnh sửa thông minh vẫn tồn tại).
- **Thanh công cụ nổi dưới:** dấu + mở đúng menu node được phép; các nút công cụ sáng tạo, thư viện nhân vật, tất cả tính năng, thư viện tài sản/lịch sử. Các ảnh menu mẫu đã được người dùng cung cấp trong cuộc hội thoại. Nhóm O (nút trợ giúp/bàn phím) được yêu cầu bỏ vì hiện không dùng — tránh đưa lại trái yêu cầu.
- **Cụm góc trái dưới:** (1) fit tất cả node vào viewport, (2) minimap nhấn để nhảy tới vị trí, (3) hiện/ẩn toàn bộ dây kết nối, (4) đánh dấu node có cổng bắt buộc chưa được nối đúng. Mức zoom được hiển thị.
- **N — Menu Canvas:** click vùng Canvas trống/mở menu theo ảnh tham chiếu; click vào node có menu theo ảnh; menu chính tối giản, mục **Thêm →** mở submenu ngang để chứa những thao tác còn lại. Chỉ giữ những thao tác mà chủ dự án duyệt.

**Lưu ý về ảnh:** Ảnh tham chiếu A/C/N/F và ảnh node ở trong hội thoại với người dùng; **chúng chưa được lưu kèm trong GitHub repo**. Khi cần pixel-perfect, hãy yêu cầu ảnh nguồn hoặc bổ sung assets thiết kế vào repo, không dựng theo tưởng tượng.

## 3. CHÍN LOẠI NODE HIỂN THỊ TRONG MENU DẤU +

Đây là danh sách loại node cho UX mới; tương thích dữ liệu cũ cần xử lý riêng:

| ID | Node | Đặc điểm UI đã chốt |
|---|---|---|
| F01 | Văn bản / Chữ | Không có thanh chỉnh sửa trên. Card đầu node thu phóng theo Canvas; **composer/Prompt bên dưới giữ kích thước hiển thị theo màn hình khi zoom**, đi theo node. |
| F02 | Kịch bản | Dùng **ảnh số 1** trong bộ ảnh 11 tấm do người dùng gửi; card kịch bản + composer/Prompt; không có thanh chỉnh sửa ảnh/video. |
| F03 | Sinh ảnh AI | Dùng **ảnh số 9** trong bộ 11 ảnh và ảnh mẫu sinh ảnh trước đó. Kết quả ảnh phía trên, Prompt ngay bên dưới trong **cùng node**, thu gọn được, không kéo dài như panel độc lập. |
| F04 | Sinh video AI | Ảnh số 2 và 8 của bộ 11 ảnh; phân biệt trạng thái trống/có video, player và composer. |
| F05 | Bàn làm việc của giám đốc | Ảnh số 3; card không gian/đạo diễn, xử lý 3D chưa được xác nhận. |
| F06 | Chỉnh sửa thông minh | Ảnh số 4, 6, 7; thanh công cụ khi chọn gồm nhân bản, cắt khung, tải về, zoom. |
| F07 | Sinh âm thanh AI | Ảnh số 5; composer, tham chiếu, model, kết quả âm thanh. Cấu hình AI ở Settings. |
| R01 | Ảnh nhập từ ngoài | Ảnh số 10; tải ảnh, dán ảnh, xem trước, kết nối. Không bắt buộc có composer tạo AI. |
| R02 | Video nhập từ ngoài | Ảnh số 11; tải video, xem/phát, kết nối. Không bắt buộc có composer tạo AI. |

**Quy tắc chung của Node:**
- Click một node để chọn. **Toolbar chỉnh sửa ảnh/video chỉ hiện khi node tương ứng được chọn**; chưa chọn / click vùng Canvas trống thì ẩn hoàn toàn, không thay đổi bố cục. Hover đơn thuần không mở toolbar. Chọn node khác thì toolbar chuyển sang loại mới; Node Văn bản/Kịch bản không có toolbar chỉnh sửa ảnh/video.
- Node có kết quả là một card tối giản; tên ở trên, cổng **dấu + tròn hai bên**, dây nối cong nằm sau nội dung.
- Prompt gắn với node, có thể thu gọn/mở rộng; phải xử lý pan/zoom đúng, không bị lệch khi co giãn Canvas.
- Nút mũi tên ↑ tạo nội dung: **sẵn sàng nền trắng**, **đang chạy hiện spinner xoay**, **lỗi chuyển nền đỏ và hiện thông tin lỗi**; thành công trở lại bình thường. Trạng thái phải phản ánh tác vụ thật, không chỉ animation giả.
- Node ảnh/video/tài nguyên có các công cụ theo ngữ cảnh; giữ ngôn ngữ tiếng Việt; theme tùy biến toàn app.
- Menu + mới **chỉ hiển thị 9 loại trên**; vẫn xử lý các loại legacy khi đọc workflow cũ nếu có.

## 4. Quy tắc luồng Canvas nhận → xử lý → gửi

**Mô hình dữ liệu mục tiêu:** Node nguồn --(cổng có loại dữ liệu)--> Node xử lý --(kết quả thành công)--> Node đích. Không chỉ vẽ dây nối.

- **Cổng:** khai báo rõ id, chiều vào/ra, kiểu text/image/video/audio (và metadata nếu cần), bắt buộc/tùy chọn, số lượng kết nối cho phép. Hiển thị cổng dấu + theo mẫu nhưng giữ được phân biệt kiểu.
- **Kết nối hợp lệ:** chỉ cho nối hai cổng tương thích; một output có thể tới nhiều node; tránh cycle hoặc thông báo chính xác nếu graph legacy có cycle.
- **Nhận:** Node đích hiển thị/tạo tham chiếu đúng tài nguyên từ Node nguồn; kết hợp đầu vào được nối với Prompt nội bộ theo loại Node.
- **Gửi:** chỉ truyền output hợp lệ đã tạo thành công, không lấy trạng thái “đang chạy/lỗi/rỗng” làm tài nguyên mới.
- **Thay đổi đầu nguồn:** Node đích nhận dữ liệu mới nhưng **không tự chạy lại AI khi chưa được yêu cầu**. Cần hiển thị kết quả đã cũ khi đầu vào thay đổi, không âm thầm gây tác vụ tính phí.
- **Thực thi:** chạy theo thứ tự topo/phụ thuộc, hỗ trợ rẽ nhánh, dừng, lỗi một nhánh không làm hỏng nhánh độc lập; phải xử lý blob/media ID và lưu/khôi phục chính xác.
- **Asset Library:** tự ghi nhận ảnh/video/audio/prompt do node tạo hoặc người dùng upload, kèm thời gian, loại, node nguồn, dự án; kéo thả tài nguyên vào input; khi tài nguyên có phiên bản mới, node được chọn “theo bản mới” hoặc “đóng băng bản cũ”.
- **Chưa được xác nhận đầy đủ:** đường truyền end-to-end cho cả 9 loại V3, đặc biệt Kịch bản → Ảnh → Video → Chỉnh sửa thông minh → Âm thanh, Director 3D và dịch vụ Audio AI. Repo 0.31.0 có graph và adapters nâng cao; phải kiểm tra test/mã hiện hữu rồi mới quyết định phần thiếu.

## 5. Các chức năng cấp ứng dụng đã thống nhất

- **Workflow:** đổi tên, lưu/chọn; xóa có hỏi “Xóa vĩnh viễn workflow này?” rồi chuyển Canvas rỗng/mặc định; nhân bản toàn bộ node, dây, thông số thành “[Tên gốc] - Copy” và mở bản sao; sort tên A-Z/ngày tạo/ngày sửa; tự căn chỉnh node trên Canvas không chồng lấn.
- **Xuất:** một nút tải JSON workflow; một nút **Chia sẻ prompt tổng** xuất nội dung node và mô tả chiều kết nối dưới dạng văn bản, modal giữa màn hình có Sao chép và Đóng.
- **Thư viện nhân vật:** kho ảnh nhân vật đã thêm; click nhân vật tạo node ảnh tài nguyên trên Canvas. Tạo nhân vật mới bằng AI cần cấu hình model **riêng** trong Settings.
- **AI Audio:** cần cấu hình dịch vụ và model tạo âm thanh trong Settings; không được tự nhận kết quả nếu chưa có backend.
- **AI Chat:** chatbot hội thoại thông thường, để hỏi linh tinh; **mặc định ẩn**, có công tắc bật/tắt trong Settings, tách cấu hình kết nối riêng. Chưa xác định provider/model cụ thể.
- **Bảng công cụ sáng tạo 4 ô+:** khi chọn mục thì tạo các node/chuỗi node trên Canvas. Các công cụ được giải thích gồm: bảng phân cảnh điều phối; storyboard; chuỗi 25 khung liên tiếp; lưới không gian mặt đất; suy luận 3 giây sau; suy luận 5 giây trước; panorama 720; lưới 9 góc máy; nhân vật đa chiều; 3 góc mặt; minh họa nhân vật; thiết kế cảnh/sản phẩm; chỉnh kết cấu chân dung; ánh sáng điện ảnh. Các tính năng AI chuyên biệt **chưa bảo đảm được mô hình AI đáp ứng**, không nên biểu diễn bằng kết quả giả.
- **“Tất cả tính năng”:** dựng giao diện trước; phải hỏi người dùng từng công cụ xử lý cụ thể sau, không tự phỏng đoán chức năng.

## 6. BẢNG NHIỆM VỤ ƯU TIÊN (AI phải cập nhật sau mỗi đợt sửa)

Trạng thái ban đầu của bảng = **CHƯA XÁC MINH TRÊN HEAD** trừ khi có bằng chứng kiểm thử. Đây là yêu cầu hoặc rủi ro cần kiểm tra, **không phải thông báo mọi mục đều là bug hiện tại**.

| Mã | Ưu tiên | Nhiệm vụ / lỗi cần điều tra | Điều kiện hoàn thành |
|---|---|---|---|
| T-001 | P0 | Đối chiếu HEAD 0.31.0 với giao diện V3 trong chat, lập bảng delta/migration, sao lưu workflow mẫu | Có danh sách điểm thiếu và test không mất dữ liệu |
| T-002 | P0 | Sửa lỗi chọn node bị nhầm với menu ngữ cảnh (được báo trong bản thử cục bộ); ẩn/hiện toolbar theo selection thật | Click chọn/khử chọn/chọn node khác đúng; không tự mở menu; test UI |
| T-003 | P0 | Hoàn thiện nhận/gửi dữ liệu có kiểu cho 9 node mới, kiểm tra graph, stale output và topo execution | Test đầu vào/đầu ra/rẽ nhánh/từ chối sai loại/cycle/error/stop/reload |
| T-004 | P0 | Kiểm tra các nút bị “chớp/nháy rồi reset” khi click — lỗi từng xuất hiện ở dự án giao diện trước; **chưa xác nhận tái hiện trên repo này** | Có bước tái hiện hoặc ghi “không tái hiện”; nếu có, sửa + test hồi quy |
| T-005 | P1 | Đổi menu + về đúng 9 loại Node; legacy workflow vẫn đọc và chạy được | Menu sạch; import JSON cũ không mất node |
| T-006 | P1 | Cố định khung Prompt ở kích thước màn hình khi Zoom, nhưng neo theo node; thu gọn/mở rộng, pan không lệch | Test zoom 50/100/150%, pan, switch selection |
| T-007 | P1 | Sửa nút ↑ thành ready/spinner/error đúng trạng thái thật cho mọi node AI | Thử chạy, lỗi, hủy, retry, hoàn tất; không có spinner treo |
| T-008 | P1 | Bổ sung chức năng xóa/nhân bản/sort workflow và modal chia sẻ prompt tổng | Test JSON, snapshot clone, xác nhận xóa, copy nội dung/sơ đồ dây |
| T-009 | P1 | Hoàn thiện library: auto-save, metadata, drag/drop vào cổng, phiên bản follow/freeze | Test tải lên, tạo nội dung, replace, đóng/mở, phân quyền dữ liệu |
| T-010 | P1 | Hoàn thiện Canvas: fit, minimap click-to-pan, toggle edge, audit thiếu cổng | Test zoom/pan và chỉ báo không kết nối đúng |
| T-011 | P1 | Tách Theme Settings khỏi AI Settings; light/dark, màu nhấn; AI Chat ẩn mặc định | Test lưu và áp theme không hỏng tương phản |
| T-012 | P1 | Hoàn thiện nhập/dán ảnh R01 và nhập/phát video R02 | Test clipboard (quyền truy cập), file media, xem/tải/kết nối |
| T-013 | P2 | Kết nối backend Audio AI và AI tạo nhân vật; cấu hình provider/model riêng | Test thật khi có cấu hình, xử lý lỗi/chi phí, không mock thành kết quả |
| T-014 | P2 | Chốt và triển khai editor thông minh/Director 3D/công cụ trong “Tất cả tính năng” | Có đặc tả được chủ dự án xác nhận và test đầu cuối |
| T-015 | P2 | Dọn menu N, ẩn mục O và ô thêm nhanh C05 theo yêu cầu, giữ thao tác còn lại | So ảnh mẫu, regression test click/menu |
| T-016 | P0 | Hồi quy các chức năng 0.31.0 (extension, desktop, host, relay, media, lưu/khôi phục) sau thay đổi UI | Test suite hiện hữu pass hoặc ghi rõ blocker/baseline |

**Phân loại ưu tiên:** P0 = bảo toàn dữ liệu / tương tác cốt lõi; P1 = UX hoàn thiện / năng lực vận hành; P2 = chức năng AI mới phụ thuộc cấu hình.

## 7. Nhật ký lỗi/rủi ro cần đọc và sửa

| Mã | Tình trạng | Quan sát / cách xử lý |
|---|---|---|
| BUG-001 | Cần kiểm tra trên GitHub HEAD | Trong bản thử V3, click node từng mở menu ngữ cảnh thay vì chọn node; bản cục bộ từng báo đã sửa. Kiểm tra repo trước, test click node, click Canvas, toolbar, prompt. |
| BUG-002 | Cần kiểm tra trên GitHub HEAD | Bản dựng trước có toolbar luôn hiện, UI node sai ảnh mẫu. Sửa **Node trong app thực**, không chỉ ảnh demo. |
| BUG-003 | Chưa xác minh tại repo này | Lỗi nút nháy rồi không thực hiện hành động từng được phản ánh ở dự án trước; rà lại event propagation/render/rerender, không kết luận có bug trước khi tái hiện. |
| BUG-004 | Lỗ hổng chức năng theo thiết kế, không nhất thiết bug regression | Luồng qua 9 node V3 chưa được chứng minh end-to-end; bắt buộc test với data graph thật. |
| BUG-005 | Chức năng chưa triển khai/chưa cấu hình | AI Audio, AI nhân vật, AI Chat, Director 3D, chỉnh sửa thông minh chuyên sâu không được báo là “thành công” khi chỉ có UI. |
| BUG-006 | Rủi ro đồng bộ phiên bản | GitHub 0.31.0 khác các bản V3 thử nghiệm trong chat; không overwrite 0.31.0 bằng ZIP cũ. So sánh, port có chọn lọc và chạy test. |

### Mẫu ghi kết quả sửa một lỗi

- Mã lỗi:
- Nhánh / commit:
- Bước tái hiện trước sửa:
- Nguyên nhân gốc:
- File/đoạn mã thay đổi:
- Test tự động / thủ công đã chạy (pass/fail):
- Ảnh trước / sau hoặc log:
- Trạng thái: Chưa xác minh / Đang sửa / Đã sửa & kiểm chứng / Bị chặn:
- Vấn đề còn lại:

## 8. Những câu hỏi chỉ hỏi lại khi đến đúng chức năng

- A10/menu ba chấm dùng làm gì?
- Từng mục chi tiết của bảng “Tất cả tính năng” xử lý đầu vào/đầu ra như thế nào?
- Provider/model cụ thể cho AI Audio, AI Chat, AI nhân vật; chính sách key, giới hạn sử dụng và quyền gọi API?
- Cách hiển thị đầu ra cho node Kịch bản và cách kết nối tới bảng phân cảnh nhiều khung?
- Chi tiết chức năng của Director 3D và editor thông minh (trình dựng thật hay tích hợp dịch vụ bên ngoài)?
- Các công cụ image/video nâng cao (HD, layer, panoramic 720, xóa phụ đề…) cần endpoint nào?
- Nhận dạng cổng input bắt buộc/tùy chọn ở từng node trong menu 9 node để “kiểm tra thiếu kết nối” chính xác.

## 9. Kiểm thử và quy trình bàn giao

Repo hiện có package.json với lệnh:
- npm ci
- npm test
- npm run test:browser
- npm run test:reliability
- npm run test:desktop
- npm start (Electron)

Test browser/desktop có thể yêu cầu môi trường, dependency hoặc display. Không tuyên bố pass nếu chưa chạy. Với macOS Intel/Ventura phải kiểm tra thực tế trước khi công bố DMG. Đừng tự gọi API AI mất phí để thử mà không được chấp thuận.

**Định dạng cập nhật sau mỗi nhiệm vụ:** ghi ngày, mã T-xxx/BUG-xxx, bước sửa, phạm vi file, kết quả test, phần chưa làm. Chủ dự án thích **ảnh xem trước** khi duyệt UI và không muốn xuất ZIP nếu không yêu cầu. Chỉ đánh dấu **🟢 có giao diện + chức năng đã kiểm tra; 🟡 mới có một phần; 🔴 chưa có**.

---

**Vị trí tài liệu chính:** docs/AI_HANDOFF_REPORT.md. File AGENTS.md ở gốc repo trỏ đến tài liệu này. AI khác có thể đọc lại và tiếp tục các nhiệm vụ theo từng phiên làm việc; tài liệu **không** tự chạy sửa lỗi hoặc theo dõi liên tục.
