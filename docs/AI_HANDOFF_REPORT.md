# BÁO CÁO BÀN GIAO CHO AI — MUSEFLOW / WORKFLOW

## BUG-008 — Không nhận kết quả từ cuộc trò chuyện AI khác (2026-11-08)

- Người dùng yêu cầu sửa lỗi đã tái hiện trên Chromium: gửi tại chat A, chuyển SPA sang chat B khi đang chờ, `ai-bridge.js` nhận câu trả lời của B và trả `ok: true`. `otherTabMessage()` còn ghi URL B vào `chatTarget`.
- Bản sửa trên nền commit `5449b33` (chưa commit/push): `ai-bridge.js` kiểm tra origin/path khi xác nhận gửi, mỗi vòng nhận kết quả và trước khi trả kết quả sau tải ảnh; trả kèm URL đã xác minh. `app.js` chỉ nhận kết quả thành công khi URL từ bridge và URL tab hiện tại đều khớp chat ban đầu; phản hồi lỗi không cập nhật chatTarget.
- Chính sách thận trọng: thay đổi origin/path, kể cả nhà cung cấp tự đổi đường dẫn từ chat mới sang chat có ID, sẽ dừng tác vụ; không tự gửi lại. Mở chat có URL ổn định trước khi chạy. Chưa bổ sung cơ chế xác thực chuyển URL tự động của nhà cung cấp.
- Test hồi quy: `node tests/ai-conversation-smoke.cjs` tái hiện rồi xác nhận chặn chat khác trên cả ChatGPT và Gemini; chỉ gửi 1 lần. `tests/desktop-ai-conversation.test.cjs` chạy routing thật với ranh giới Chrome mô phỏng: URL tab đổi, phản hồi lỗi, phản hồi sai URL, và thành công giữ nguyên target. Các test mới đã thất bại trước sửa.
- `npm test`: 128/128 pass; `npm run test:reliability`, `npm run test:desktop`, `node tests/gpt-response-smoke.cjs`: pass. Dịch vụ AI/DOM được mô phỏng; chưa xác minh tài khoản AI thật.
- Browser smoke toàn ứng dụng có lỗi nền đã tái hiện trước bản sửa: `tests/browser-smoke.cjs:52` chờ bộ chọn chat cũ đang bị CSS ẩn. Không sửa lỗi test đó trong BUG-008.

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

| BUG-007 | **Đã tái hiện qua CI / chưa sửa** | macOS CI `npm test` thất bại tại `tests/desktop-policy.test.cjs:73` do so sánh canonical `/private/var/...` với noncanonical `/var/...`; nguồn dùng `realpathSync`, test dùng `path.join`. Giữ kiểm tra symlink/traversal khi sửa; xem mục 11. |\n\n### Mẫu ghi kết quả sửa một lỗi

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


## 10. Lộ trình làm lần lượt, hỏi trước khi sửa (cập nhật 2026-11-08)

**Quy tắc được chủ dự án yêu cầu:** Mỗi phần phải được mô tả trước cho chủ dự án biết và hỏi duyệt khi cần quyết định; hoàn thành từng phần mới chuyển phần khác. Khi sửa giao diện, gửi **ảnh chụp từ mã chạy thực tế** (trước/sau và trạng thái cần kiểm tra), không thay bằng mock. Sau mỗi phần ghi lại thay đổi, test, lỗi còn lại và **SHA/link commit** trong tài liệu GitHub. Không tự xuất ZIP trừ khi yêu cầu. Với phần chỉ đọc tài liệu/kiểm thử không có thay đổi UI thì báo cáo kết quả, không tạo ảnh “sau sửa” giả.

### Kết quả rà soát bước đầu (chỉ kiểm tra tệp, KHÔNG phải test chạy)

- Nhánh GitHub `main` đang thể hiện `Workflow · MuseFlow 0.31.0` trong `README.md`, `manifest.json` và `package.json`. Có extension + Electron desktop, cần bảo toàn đường dữ liệu của cả hai.
- `app.html` còn thanh công cụ cũ, `#addNodeMenu` chứa **nhiều hơn 9 kiểu node**; không tương ứng UI đã duyệt của V3. Không được thay/xóa các node cũ trong dữ liệu workflow mà không có kiểm thử tương thích.
- `app.js` có `nodeDefs` cho prompt, text, imageInput, generateImage, generateVideo, videoInput, timeline, imageResize, preview và nối định nghĩa module `WorkflowTools`/`WorkflowStudio`/`WorkflowStory`. Không kết luận 9 node V3 hoàn chỉnh chỉ vì có những định nghĩa này.
- `styles.css` hiện còn quy tắc node dạng card truyền thống và thanh status có màu nền riêng; yêu cầu thiết kế V3 khác. Những mô tả “đã làm V3” ở hội thoại trước không phải bằng chứng phần code ấy đã nằm trên GitHub.
- `package.json` định nghĩa `npm test`, `npm run test:browser`, `npm run test:reliability`, `npm run test:desktop`. **Chưa chạy** các lệnh này trong bước rà soát tài liệu.

### Chia phần triển khai

| Phần | Mã liên quan | Công việc và sản phẩm cần duyệt | Điều kiện để đánh dấu xong | Trạng thái |
|---|---|---|---|---|
| 01 — Khảo sát hiện trạng & an toàn dữ liệu | T-001, BUG-006 | Đối chiếu repo 0.31.0 với yêu cầu V3; lấy workflow mẫu/bộ test; lập bảng tương thích; kiểm tra cách sao lưu | Bảng delta chi tiết, kiểm thử import/export/không mất dữ liệu; chưa sửa UX | **Đã bắt đầu; chưa hoàn tất** |
| 02 — Đo baseline và lỗi click | T-016, T-002, T-004, BUG-001–003 | Chạy test hiện có, tái hiện chọn node/menu, lỗi nút nháy (nếu có) | Log before/after, ảnh chọn/bỏ chọn, regression test | Chờ |
| 03 — Menu + và hành vi cơ bản Canvas | T-005, T-010, T-015 | Menu đúng 9 loại; giữ đọc node legacy; fit, minimap, hiện dây, audit nối, menu N | Ảnh từ app chạy thật; thao tác click và import cũ pass | Chờ |
| 04 — Ngoại hình 9 Node | T-006, T-007 | Phục dựng theo ảnh người dùng: F01–F07, R01–R02; chọn thì mới hiện toolbar, prompt neo đúng zoom; nút ↑ ba trạng thái | Ảnh chụp node trạng thái chưa/chọn, zoom 50/100/150%, test event và run state | Chờ |
| 05 — Luồng dữ liệu Canvas | T-003, BUG-004 | Typed input/output, một output tới nhiều node, topo/cycle, truyền text/image/video/audio, stale output, lỗi/dừng | Test graph/branch/missing media/khôi phục; không tự rerun AI | Chờ |
| 06 — Workflow và Kho tài sản | T-008, T-009 | Tên/sao chép/xóa/sort; JSON/prompt tổng; lịch sử tài nguyên, drag-drop, follow/freeze phiên bản | Test lưu/đóng/mở/khôi phục và ảnh các cửa sổ | Chờ |
| 07 — Settings và nhập tài nguyên | T-011, T-012 | Theme sáng/tối/màu nhấn; Settings AI riêng; AI Chat ẩn mặc định; ảnh dán/tải, video tải/phát | Test theme persistence, clipboard/media, ảnh giao diện | Chờ |
| 08 — Kết nối AI bổ sung | T-013, BUG-005 | AI âm thanh, AI tạo nhân vật và AI chat | Chỉ làm khi chủ dự án xác nhận model/provider và quyền thử; có test thật | Chờ |
| 09 — Tính năng chuyên biệt | T-014 | Director 3D, chỉnh sửa thông minh và từng mục “Tất cả tính năng” | Xin mô tả cụ thể từng tính năng rồi mới code; test end-to-end | Chờ |

### Nhật ký thực hiện (bổ sung theo mỗi commit)

**2026-11-08 — Phần 01: rà soát sơ bộ và chia lộ trình**
- Phạm vi: đọc `AGENTS.md`, `README.md`, `docs/AI_HANDOFF_REPORT.md`, `docs/APP-ARCHITECTURE.md`, `docs/PROGRESS.md`, `package.json`, phần đầu `app.html`, `app.js`, `styles.css` trên `main`.
- Phát hiện: sự khác nhau giữa phiên bản 0.31.0 trên GitHub và yêu cầu giao diện V3; menu tạo node hiện chưa giới hạn 9 mục; nhiều thành phần CSS/HTML vẫn là bố cục cũ.
- Thay đổi: **chỉ thêm báo cáo và kế hoạch vào tài liệu này**, không sửa mã chương trình/không thay đổi hành vi người dùng.
- Kiểm thử: **chưa chạy** npm test/browser/desktop; không có ảnh UI trước-sau vì chưa thay đổi UI. Đây không phải báo cáo sửa bug.
- Việc cần duyệt tiếp: **Phần 01 bước tiếp theo — khảo sát chi tiết và chạy kiểm thử bảo toàn dữ liệu trước khi bắt đầu sửa UI.**
- Commit: xem lịch sử commit tệp `docs/AI_HANDOFF_REPORT.md` cho cập nhật ngày 2026-11-08.


## 11. PHẦN 01 — Kiểm tra baseline lưu/khôi phục và GitHub CI (2026-11-08)

**Phạm vi được chủ dự án phê duyệt:** Chỉ đọc, rà soát dữ liệu/node/dây nối, kiểm tra bài test hiện có và ghi báo cáo; **KHÔNG sửa mã ứng dụng hoặc UI**. Đây là kết quả điều tra bằng mã và log CI thật, không phải kết quả kiểm thử end-to-end Muse.ai hoặc chạy app trên máy người dùng.

### 11.1 Phiên bản/nguồn kiểm tra

- Repo: `mktminhqpbga-glitch/workflow`; nhánh `main`, version `0.31.0`. Bản V3 trước đây trong hội thoại chưa được merge vào `main`.
- Dùng log **GitHub Actions macOS**: [Run #42399416161](https://github.com/mktminhqpbga-glitch/workflow/actions/runs/42399416161), commit `dca6e604872c6747b516017bc7159028642dece0`, chạy vào 2026-11-07 18:04 UTC. Các commit kế tiếp trước lần rà soát này chỉ chỉnh tài liệu; không thay code runtime/test.
- Workflow CI `.github/workflows/desktop.yml` chạy `npm test` trên `macos-latest`; **không tự chạy** `test:browser`, `test:reliability`, `test:desktop` trong job này.
- Môi trường làm việc tại phiên rà soát không truy cập trực tiếp `github.com` bằng Git CLI, nên **không clone được repository để chạy các lệnh test riêng**. Báo cáo dùng bằng chứng từ GitHub Actions và kiểm tra nguồn qua GitHub connector; không ghi nhầm là vừa chạy cục bộ.

### 11.2 Kết quả đơn vị từ CI macOS

| Nội dung | Kết quả | Bằng chứng |
|---|---|---|
| `npm ci` | ✅ Thành công | CI step **Install locked dependencies** |
| `npm run setup:desktop` | ✅ Thành công | CI step **Prepare Electron runtime** |
| `npm test` | 🔴 **95 pass / 1 fail / 96 total** | CI step **Run unit tests** |
| Tạo ZIP macOS unsigned | ⚪ Không chạy | Bước build/upload bị **skipped** do unit tests fail |
| `npm run test:browser` | ⚪ Chưa chạy trong đợt này | Không có step tương ứng trong CI hiện tại |
| `npm run test:reliability` | ⚪ Chưa chạy trong đợt này | Không có step tương ứng trong CI hiện tại |
| `npm run test:desktop` | ⚪ Chưa chạy trong đợt này | Không có step tương ứng trong CI hiện tại |
| Kiểm tra macOS Intel 13 Ventura / AI đăng nhập thật | ⚪ Chưa chạy | Cần phần mềm và môi trường thực của người dùng |

**Lỗi CI đã được xác nhận — BUG-007 (P0 để mở lại quy trình CI):**
- Test: `tests/desktop-policy.test.cjs:57`, assertion đầu tiên ở dòng **73** trong test *“app protocol serves only bundled public resources and rejects traversal/symlink escapes”*.
- Thực tế macOS: `/private/var/folders/.../app/app.html`; kỳ vọng từ `path.join(root,'app.html')`: `/var/folders/.../app/app.html`.
- Kiểm tra mã: `desktop/policy.cjs:73-74`, `resolveAppPath()` dùng `fs.realpathSync(root)` và `fs.realpathSync(candidate)` để khóa đường dẫn theo canonical real path; trong khi test lại so sánh với `path.join(root,...)` chưa canonicalize. Từ log và mã, **nhiều khả năng sai ở kỳ vọng test**, không có bằng chứng nguồn của bug lộ tệp riêng tư. Không thay logic bảo vệ đường dẫn chỉ để test xanh.
- Lỗi có từ ít nhất [Run #39979597891, 2026-10-23](https://github.com/mktminhqpbga-glitch/workflow/actions/runs/39979597891), với cùng tiền tố khác nhau; không phải hồi quy do commit tài liệu mới.
- **Đề xuất khi được duyệt sửa:** Thay assertions kỳ vọng bằng canonical path phù hợp trên macOS; giữ mọi case chặn traversal, symlink ngoài root và tệp riêng; chạy lại toàn bộ `npm test` trên macOS và kiểm tra build bước sau. **Trạng thái: xác minh nguyên nhân, CHƯA SỬA.**

### 11.3 Kiểm tra an toàn dữ liệu và tính bao phủ test

| Chủ đề | Đánh giá | Chứng cứ / giới hạn |
|---|---|---|
| Các dự án tách riêng storage, vẫn đọc được sau khi tạo ProjectStore mới | 🟢 Có unit test, thuộc nhóm pass CI | `tests/desktop-projects.test.cjs`, test “projects isolate local storage and persist…” |
| Ghi đồng thời được serialize và snapshot giá trị trước khi enqueue | 🟢 Có unit test, thuộc nhóm pass CI | `tests/desktop-projects.test.cjs`, test “concurrent storage patches…” |
| Canvas trống đã lưu không bị tự ghi thành workflow mẫu | 🟢 Có unit test, thuộc nhóm pass CI | `tests/desktop-projects.test.cjs`, test “saved empty canvas remains empty…” |
| Tệp hiện tại lỗi JSON: chặn ghi đè, cho khôi phục backup, giữ lại bytes bản hỏng | 🟢 Có unit test, thuộc nhóm pass CI | `tests/desktop-projects.test.cjs`, test “corrupt current file…” |
| Backup hợp lệ phục hồi, backup sai không đè trạng thái hiện hành | 🟢 Có unit test, thuộc nhóm pass CI | `tests/desktop-projects.test.cjs` test restore/missing-corrupt backup |
| Chặn ID dự án/path traversal/symlink project | 🟢 Có unit test, thuộc nhóm pass CI | `tests/desktop-projects.test.cjs` test invalid IDs/symlinks |
| Tái tạo Node + **dây nối không rỗng** qua đóng/mở dự án | 🟡 **Chưa có bằng chứng end-to-end ở CI này** | Unit test ProjectStore dùng `edges: []`; các smoke khác có graph nhiều dây nhưng chưa chạy trong CI này |
| Import workflow JSON + truyền ảnh/video qua dây | 🟡 Có test script; **chưa chạy trong CI này** | `tests/browser-smoke.cjs` chứa graph prompt+ảnh→generateImage và videoInput→generateText |
| Mất media IndexedDB, autosave không ghi đè graph lỗi, khôi phục sau reload | 🟡 Có test script; **chưa chạy trong CI này** | `tests/core-reliability-smoke.cjs` |
| Graph có chu trình ở nhánh khác vẫn chạy nhánh độc lập; chu trình trong nhánh đích bị chặn | 🟡 Có test script; **chưa chạy trong CI này** | `tests/core-reliability-smoke.cjs` |
| Desktop thực: tắt ứng dụng khi chưa lưu, khôi phục dự án, từ chối save failure | 🟡 Có smoke script; **chưa chạy trong CI này** | `tests/desktop-smoke.cjs` |

### 11.4 Kết luận Phần 01 và cửa kiểm soát trước khi đổi UI

1. **Đã xác minh baseline bằng CI:** 96 test, 95 pass, 1 fail. Chưa đủ điều kiện gọi CI xanh hoặc công bố bản build mới.
2. **Đã tìm lỗi cụ thể cần sửa:** BUG-007 (macOS canonical vs noncanonical path trong test). Ghi lại cách tái hiện, file liên quan và nguyên tắc sửa an toàn.
3. **Đã xác minh có cơ chế giữ dữ liệu cũ** trong ProjectStore và các unit tests tương ứng. Điều này **chưa chứng minh toàn bộ 9 loại node V3 và mọi dây** luôn khôi phục đúng.
4. **Chưa thay đổi UI hoặc production code**, không có ảnh trước/sau của app vì không có sự thay đổi hình ảnh. Khi làm UI ở các phần sau phải chụp ảnh trực tiếp từ app chạy thực tế.
5. **Chưa thể đóng T-001 hoàn toàn**: còn thiếu kiểm thử độc lập cho workflow có nhiều node/dây thực sau save→close→reopen, và chạy browser/reliability/desktop smoke trên HEAD. Nên làm trước khi migrate hệ thống 9 node.
6. Đề nghị chủ dự án duyệt bước sửa nhỏ **BUG-007 và bổ sung test round-trip cho node+dây nối** trong phần tiếp theo, rồi mới sửa UX. Mỗi sửa đổi cần commit riêng, có log chạy test và ảnh nếu có thay đổi hiển thị.

**Nhật ký:** Phần 01 — đã hoàn thành đợt kiểm tra mã + log CI và lưu báo cáo, tình trạng tổng thể **🟡 còn hạng mục chưa xác minh**, không sửa runtime. Tham khảo GitHub commit đã chứa lần cập nhật mục 11 này.


## 12. TIỂU PHẦN NODE — F01 Văn bản: kiểm kê nút và chờ duyệt hành vi

**Ghi nhận 2026-11-08:** Chủ dự án muốn chuyển trọng tâm từ BUG-007 sang **các nút bên trong Node**, mỗi phần nhỏ hỏi trước khi triển khai, sau đó gửi ảnh app chạy thật + báo cáo commit. BUG-007 vẫn mở, không tự sửa.

### Kiểm kê F01 dựa trên repo GitHub `main` (không kế thừa nhãn 'hoàn thành' của mock V3)

| Mã | Nút/điều khiển F01 theo ảnh mẫu | Trạng thái có căn cứ trên `main` | Ghi chú |
|---|---|---|---|
| T01 | Nhập/sửa nội dung văn bản | 🟡 Một phần | Có `prompt` textarea và output read-only của `generateText`, nhưng chưa phải composer F01 chuẩn. |
| T02 | “Tự viết nội dung” | 🔴 Chưa thấy điều khiển riêng | Cần xác nhận click sẽ mở chế độ nhập tay hay chèn mẫu prompt. |
| T03 | “Văn bản thành video” | 🔴 Chưa thấy điều khiển riêng | Có node `generateVideo` legacy; chưa có chuyển tác vụ từ F01 qua F04 như ảnh mẫu. |
| T04 | “Ảnh suy ngược Prompt” | 🔴 Chưa thấy điều khiển riêng | `generateText` có đầu vào ảnh, nhưng cần xác nhận luồng UI/chọn ảnh/model. |
| T05 | “Văn bản thành nhạc” | 🔴 Chưa thấy điều khiển riêng | Có các node audio legacy; chưa chứng minh được F01 → audio AI tạo nhạc. |
| T06 | Chọn model AI trong composer | 🟡 Một phần | `providerControls()` có sẵn trong `generateText`; khác ảnh mẫu. |
| T07 | Nút dịch/ngôn ngữ | 🔴 Chưa xác minh điều khiển riêng | Không tự gán dịch AI hay dịch UI khi chưa có mô tả. |
| T08 | Nút chạy ↑ ba trạng thái | 🟡 Một phần | `createNodeRunActions()` hiện là `▶ Run Văn bản`, khi chạy là `■ Stop`; chưa đúng nút ↑ trắng/spinner/đỏ được yêu cầu. |
| T09 | Mở rộng/thu gọn Prompt | 🔴 Chưa đúng theo ảnh mẫu | Không thể coi `details` legacy là hoàn tất yêu cầu composer neo node, zoom bất biến. |
| T10 | Cổng + nhận/gửi Node | 🟡 Một phần | `nodeDefs.generateText` và `addPorts()` có kiểu text/image/video nhưng giao diện cổng chưa theo mẫu và chưa test V3. |

**Quy tắc thiết kế F01 đã chốt:** Không có toolbar chỉnh sửa ảnh/video phía trên; phần card node zoom cùng Canvas; composer phía dưới giữ kích thước màn hình; click chọn/bỏ chọn đúng quy tắc; không xóa luồng `generateText` cũ hay hỏng graph legacy.

### Chia F01 thành các bước nhỏ

1. **F01-A: Nhập nội dung + nút “Tự viết nội dung”** — hỏi và chốt hành vi click; triển khai giao diện + lưu nội dung, test giữ data và selection. Chụp ảnh chưa/chọn node, trước/sau zoom. Commit riêng.
2. **F01-B: Bốn lối tắt ở card** — Văn bản→video, Ảnh→prompt, Văn bản→nhạc; hỏi về kết quả và cổng tương ứng; không tự tạo AI result giả. Commit riêng.
3. **F01-C: Composer** — provider/model, dịch, mở rộng/thu gọn, nút ↑ ba trạng thái; gắn action vào tác vụ thật, xử lý lỗi, dừng. Commit riêng và test.
4. **F01-D: Node + dây + lưu/khôi phục** — input/output có kiểu, truyền nội dung và JSON, kiểm thử tương thích import legacy; commit và ghi log.

**ĐÃ CHỐT bởi ảnh người dùng:** T02 là chế độ nhập tay, có toolbar định dạng trên khi chọn; T03 là nối text→video, T04 là ảnh→prompt (có chọn nguồn ảnh), T05 là text→nhạc; T06 chọn AI/model/tab; T07 dịch hai chiều Việt↔Anh; T08 chỉ gửi Prompt. T09 đã có ảnh mẫu bổ sung. Xem docs/NODE_BUTTON_INVENTORY.md. Chưa sửa runtime.

**Kiểm thử trong mục này:** Mới đọc nguồn `app.js` (`renderNode`, `providerControls`, `createNodeRunActions`, `addPorts`) trên GitHub; chưa chạy ứng dụng, chưa tạo ảnh UI mới, chưa kiểm thử AI thật.


## 13. DANH SÁCH NÚT CHUẨN MỚI NHẤT (2026-11-08)

Chủ dự án yêu cầu **cập nhật lại danh sách nút trước khi code** và vừa cung cấp các ảnh F02 S01 (ảnh 1+2+3), S02 (ảnh 4+5+6+7), S03 (ảnh 8), đồng thời ảnh bổ sung F01 T09. Đã đối chiếu mô tả và tổng hợp **122 nút con của 9 Node** vào tài liệu riêng: **[docs/NODE_BUTTON_INVENTORY.md](NODE_BUTTON_INVENTORY.md)**.

- Danh sách này phân biệt **mẫu đã chốt** và **mức độ triển khai thật trên GitHub**. Một phần legacy có thể tồn tại dưới tên khác; màu vàng/đỏ vẫn cần code/test xác nhận.
- F01 T02 viết tay, không gửi AI; T06 chọn provider/model/tab; T07 dịch Việt↔Anh; T08 chỉ là nút gửi; T09 theo ảnh mới. F02 S01 là toolbar các tác vụ kịch bản/đồ họa, không phải toolbar HD ảnh; S02 có ảnh nhân vật, S03 là bảng phân cảnh nhiều cột.
- **Chưa sửa runtime, chưa có screenshot app sau sửa**, chỉ cập nhật tài liệu. Phần tiếp theo phải được chủ dự án duyệt riêng, sửa xong gửi ảnh app thật, test và commit.


## 14. Xác nhận tám nhóm nút chung: dịch Prompt và chế độ soạn mở rộng

**Chủ dự án xác nhận 2026-11-08.** Xem tài liệu triển khai chuẩn **[NODE_BUTTON_INVENTORY.md](NODE_BUTTON_INVENTORY.md)** (mục *Quy tắc bắt buộc* và *Xác nhận nhóm điều khiển chung*). Chưa có thay đổi runtime.

- T07/S07/A09: **chỉ dịch chữ bên trong ô nhập Prompt** giữa tiếng Việt và tiếng Anh; không đổi giao diện/Node. Giữ nguyên bản gốc để hoàn tác.
- T09/S09/I22/V21/D09/E16/A13: chế độ thường là **Prompt bên dưới Node**; bấm icon mũi tên chéo thì **panel Prompt phóng lớn nổi phủ Canvas** như hai ảnh người dùng gửi, bấm lại về thường; không làm mất Prompt và ảnh tham chiếu, model, cài đặt. Không nhầm mở rộng với ẩn Prompt hoặc rút thành một hàng.
- T08/S08/I21/V19/D04/E15/A11: nút gửi Prompt chỉ gửi khi bấm, trắng khi sẵn sàng, spinner khi chạy, đỏ khi lỗi.
- T06/S06/I06/V06/A05: chọn AI → model/tab; **chỉ hiển thị AI đã kết nối**; dropdown giống ảnh người dùng, không hardcode tên model giả.
- Thêm tham chiếu, tải kết quả, zoom/xem lớn, nhân bản Node: chủ dự án đã chấp nhận yêu cầu hành vi dùng chung được mô tả trong tài liệu kiểm kê.
- Trạng thái **đã chốt đặc tả** ≠ **đã code và test**. Không đổi các nút từ 🟡/🔴 sang 🟢 nếu không có commit sửa mã và bằng chứng test. Muốn bắt đầu code phải báo phạm vi sửa và được chủ dự án duyệt.


## 15. C02/C04 — Đợt sửa code dùng chung và kiểm tra thành phần (2026-11-08)

**Được chủ dự án phê duyệt:** bắt đầu sửa các nút dùng chung **C02 Dịch Prompt (T07/S07/A09)** và **C04 Mở rộng/thu gọn Prompt (T09/S09/I22/V21/D09/E16/A13)**; gửi hình và ghi báo cáo vào commit. Phạm vi trong đợt này là xây dựng bộ điều khiển dùng chung, bước đầu gắn vào **các Node cũ thực sự có ô textarea chỉnh sửa trên GitHub**, không tự tuyên bố hoàn tất đủ 3/7 Node V3.

### Mã đã thay đổi và commit

- `shared-node-controls.js`: component dùng chung, nút dịch Prompt, dò chiều Việt↔Anh, giữ bản gốc để hoàn tác; mở rộng thành editor cỡ lớn và thu về; đồng bộ textarea nguồn, đóng an toàn khi Canvas render lại.
- `shared-node-controls.css`: style khung editor lớn và nút tương ứng.
- `app.html`: tải hai asset mới.
- `app.js`: `translateNodeDraft()` gọi provider AI đã chọn **chỉ khi bấm Dịch**, tích hợp `WorkflowSharedNodeControls.attach()` với ô nhập hiện có trên Canvas. Chưa có model picker V3 hay tất cả composer V3.
- `tests/desktop-shared-node-controls.test.cjs`: kiểm tra nhận diện tiếng Việt/Anh. Tệp test được thêm vào glob `npm test` do tên khớp `tests/desktop-*.test.cjs`.
- Các commit code liên quan (theo thứ tự): `0e3e5157106f`, `399a154be50b`, `c46859756f29`, `57c356f01e29`, `750c749ab363`, `dca13b80c81a`, `8a2d8b843604`, `99bf19501788`, `ce73dfe198fc` (bao gồm file test tạm đã xóa).

### Bằng chứng kiểm thử

1. **CI GitHub Actions macOS run #42404826169** (SHA `ce73dfe198fc`): `npm test` **97 tổng / 96 pass / 1 fail**. Bài kiểm thử mới `desktop-shared-node-controls.test.cjs` được chạy trong tổng 97 bài; lỗi duy nhất vẫn là **BUG-007: macOS `/private/var` vs `/var`** trong `desktop-policy.test.cjs`. Build macOS bị skip. URL: https://github.com/mktminhqpbga-glitch/workflow/actions/runs/42404826169
2. **Kiểm thử GUI độc lập trong Chromium bằng Playwright tại môi trường làm việc:** PASS cho attach, expand, đồng bộ chỉnh sửa, shrink, **dịch mô phỏng**, undo và không có `pageerror`. Ảnh đã chụp: `MuseFlow_Shared_Nuts_Binh_Thuong.png`, `MuseFlow_Shared_Nuts_Prompt_Mo_Rong.png`, `MuseFlow_Shared_Nuts_Sau_Khi_Dich_Mo_Phong.png`. **Đây là fixture của component, không phải ảnh screenshot toàn bộ GitHub app đang chạy**; ảnh cung cấp trong cuộc hội thoại và chưa thêm vào repo.
3. **Chưa kiểm thử**: dịch thật qua tài khoản AI, nhiều Node V3 khác nhau, lưu/khôi phục toàn bộ Prompt và thumbnail, zoom và tương tác trên Canvas app thật. Không đánh dấu hai nhóm “🟢 đã hoàn thiện V3”.

### Vấn đề còn lại, ưu tiên tiếp

- **C02 và C04 = 🟡 đang triển khai**, vì chỉ gắn vào ô textarea phù hợp trong mã cũ. Các Node V3 như Script/Audio đang dùng cấu trúc khác hoặc chưa có composer chuẩn. Cần code tích hợp từng Node và test thật, đặc biệt S07/A09, S09/I22/V21/D09/E16/A13.
- Editor mở rộng hiện có chữ và nút dịch nhưng **chưa mang đầy đủ model picker, tài nguyên tham chiếu và nút gửi từ composer V3 theo ảnh mẫu**. Không được gọi là pixel-perfect hoặc hoàn chỉnh.
- Chưa có các bài test giao diện toàn ứng dụng qua browser smoke hoặc desktop smoke sau thay đổi. Khâu này phải thực hiện/ghi rõ blocker trước khi công bố hoàn thành.
- Lỗi BUG-007 vẫn chưa được sửa theo yêu cầu hoãn trước đó.

**Quy tắc báo cáo:** chỉ tăng trạng thái lên 🟢 sau khi code đúng Node, chức năng thật hoạt động và có bằng chứng kiểm thử; cập nhật bản chụp màn hình chạy thực của toàn ứng dụng và commit mới ở giai đoạn đó.


### 2026-11-08 — Quy tắc floating toolbar cho mọi Node

**Chủ dự án chốt:** Chưa có kết quả → **không hiển thị thanh công cụ nổi phía trên** ở bất kỳ Node nào. Có kết quả nhưng chưa chọn → vẫn ẩn. Chỉ **đã có kết quả + Node được chọn** → mới hiện toolbar phù hợp. Không tự nổi chỉ do hover. Prompt/bộ điều khiển ở dưới vẫn có thể hiển thị trên Node rỗng; phân biệt với thanh công cụ nổi.

Đã cập nhật adapter dùng chung trong `node-common-actions.js`, `app.js` và test. I10 F03 chỉ xuất hiện trên ảnh kết quả đang chọn; vào chế độ đánh dấu/chọn vùng rồi hiển thị Prompt để mô tả thay đổi theo ảnh bổ sung của user. **Chức năng xử lý ảnh theo vùng chưa triển khai**; không dùng ảnh mẫu làm bằng chứng UI đã code.
