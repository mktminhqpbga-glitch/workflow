# Danh sách các nút trong 9 Node — MuseFlow V3

**Ngày chốt ảnh:** 2026-11-08. **Nguồn:** ảnh và giải thích do chủ dự án gửi trong cuộc hội thoại. **Nguồn mã kiểm tra:** repo mktminhqpbga-glitch/workflow tại nhánh main, hiện vẫn là Workflow · MuseFlow 0.31.0.

**Mục đích:** Danh sách chuẩn trước khi thêm/sửa các nút; AI phải dùng đúng mã F/T/S/I/V/D/E/A/U dưới đây, hỏi và làm từng phần, gửi ảnh app thật và commit sau khi sửa.

## Quy ước màu — TUYỆT ĐỐI KHÔNG NHẦM MẪU VỚI CÀI ĐẶT

- 🟢 **Đã có giao diện + chức năng thực tế, được kiểm thử.**
- 🟡 **Có nền tảng hoặc một phần trong mã cũ; chưa đủ UI V3/chưa có kiểm thử V3.** Không gọi hoàn thiện.
- 🔴 **Chưa triển khai đúng yêu cầu V3 hoặc chưa thấy bằng chứng triển khai.**
- Cột **“Mẫu & hành vi”** là **đặc tả đã trao đổi**, KHÔNG phải bằng chứng đã lập trình. Đối với các nhóm F03–R02 chỉ là đánh giá sơ bộ trên khả năng legacy; cần kiểm tra code chi tiết trước khi đổi trạng thái.
- Các ảnh gốc đang ở hội thoại người dùng và chưa được nhúng vào repo. Tên “F01-1..6”, “F02-1..8” là thứ tự ảnh trong từng lượt người dùng; không phải đường dẫn GitHub. Ảnh mới nhất riêng **F01-T09** ghi nhận ở lượt kế tiếp.

## Tổng quan kiểm kê

| Mã | Nhóm Node | Số nút | 🟡 Có một phần | 🔴 Chưa triển khai V3 |
|---|---|---:|---:|---:|
| F01 | Văn bản | 10 | 8 | 2 |
| F02 | Kịch bản | 10 | 7 | 3 |
| F03 | Sinh ảnh AI | 22 | 10 | 12 |
| F04 | Sinh video AI | 21 | 13 | 8 |
| F05 | Bàn làm việc của giám đốc | 9 | 2 | 7 |
| F06 | Chỉnh sửa thông minh | 16 | 8 | 8 |
| F07 | Sinh âm thanh AI | 13 | 8 | 5 |
| R01 | Ảnh tải lên | 10 | 9 | 1 |
| R02 | Video tải lên | 11 | 10 | 1 |

## F01 — Văn bản

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| T01 | Ô nhập nội dung | Nhập và chỉnh sửa văn bản trực tiếp trong card; lưu vào workflow; xuất cổng text. | 🟡 |
| T02 | Tự viết nội dung | Ảnh F01-1: card soạn văn bản trống; toolbar định dạng khi chọn (màu, kiểu chữ, đậm, nghiêng, gạch ngang, mở rộng); không tự gọi AI. | 🟡 |
| T03 | Văn bản → Video | Ảnh F01-2: card văn bản có nội dung nối bằng dây sang Node Video/bảng hình, đưa text làm đầu vào. | 🟡 |
| T04 | Ảnh → suy ngược Prompt | Ảnh F01-3/4/5: nguồn ảnh nối tới F01; khi chọn mở Prompt phân tích ảnh, cho chọn ảnh tải máy hoặc lịch sử/tài sản; kết quả text đưa trở lại node. | 🟡 |
| T05 | Văn bản → Nhạc | Ảnh F01-6: nội dung text nối tới audio node; không thay bằng mock âm thanh khi chưa tích hợp AI. | 🟡 |
| T06 | Chọn AI, model và tab | Chọn nhà cung cấp AI và model, sau đó chọn tab/cuộc hội thoại đã đăng nhập tương ứng. Không chỉ là một dropdown tên model. | 🟡 |
| T07 | Dịch hai chiều | Chỉ dịch nội dung chữ đang có trong ô nhập Prompt: Việt → Anh hoặc Anh → Việt; không dịch giao diện/tên Node. Giữ bản gốc để hoàn tác. | 🔴 |
| T08 | Gửi Prompt ↑ | Nút mũi tên trắng gửi Prompt đang nhập tới AI/tab đã chọn; khi xử lý hiện spinner, khi lỗi màu đỏ; KHÔNG có nghĩa tự tạo nội dung nếu không bấm. | 🟡 |
| T09 | Thu gọn / mở rộng Prompt | **Hai ảnh mới ngày 2026-11-08:** chế độ thường là composer nằm dưới Node; bấm icon hai mũi tên chéo để phóng thành khung soạn thảo lớn nổi phía trước Canvas; bấm lại để thu về composer thường. Giữ chữ/ảnh tham chiếu/model, vị trí neo và zoom. | 🔴 |
| T10 | Cổng nhận/gửi | Dấu + hai bên, dây cong; input/output text, ảnh (cho suy ngược), video/audio theo chức năng, chỉ truyền dữ liệu hợp lệ. | 🟡 |

## F02 — Kịch bản

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| S01 | Kịch bản → tạo phân cảnh/tài sản | Ảnh F02-1/2/3: Text Node nối tới Trình tạo kịch bản; khi chọn script hiện toolbar chuyên biệt gồm menu: Tạo hình ảnh nhân vật, Tạo đồ thị cảnh, Tạo ảnh sản phẩm; Sáng tạo toàn năng; Tải xuống. Không dùng toolbar chỉnh sửa ảnh cho script. | 🟡 |
| S02 | Nhân vật/ảnh → tạo kịch bản | Ảnh F02-4/5/6/7: Nhiều ảnh nhân vật cùng nối vào Trình tạo kịch bản; Prompt gắn node chứa thumbnail tham chiếu 1,2…, có nút + chọn nguồn (Canvas hiện tại / tải lên cục bộ / kho tài sản cá nhân); sau gửi mới có kịch bản. | 🟡 |
| S03 | Tự viết kịch bản phân cảnh | Ảnh F02-8: giao diện bảng phân cảnh với bước Xác nhận ống kính / Chuẩn bị tài sản / AI tổng hợp; các cột số cảnh, thời lượng, hình ảnh, góc máy, ánh sáng, lời thoại, âm thanh, chuyển động máy và thao tác. Không nhầm thành ô textarea đơn giản. | 🔴 |
| S04 | Nhập nội dung kịch bản | Có vùng nhập/chỉnh sửa kịch bản bên trong Node và có thể nhận text từ F01. | 🟡 |
| S05 | Thêm ảnh tham chiếu | Dùng ảnh từ Canvas, tệp cục bộ hoặc kho tài sản; nhận nhiều ảnh, hiển thị thumbnail đúng thứ tự. | 🟡 |
| S06 | Chọn AI/model/tab | Giống F01-T06: provider, model, tab/cuộc trò chuyện đã đăng nhập. | 🟡 |
| S07 | Dịch Việt ↔ Anh | Giống T07: dịch **chỉ văn bản trong ô nhập Prompt** Việt ↔ Anh, không đổi toàn bộ UI. | 🔴 |
| S08 | Gửi Prompt ↑ | Giống F01-T08: chỉ gửi tác vụ, ready/trong khi chạy/lỗi ba trạng thái; không tự chạy khi nguồn đổi. | 🟡 |
| S09 | Thu gọn / mở rộng Prompt | Giống T09: thường = khung dưới Node, mở rộng = panel nhập lớn nổi trên Canvas bằng icon mũi tên chéo; không làm mất ảnh tham chiếu/chữ. | 🔴 |
| S10 | Hiển thị và gửi kết quả kịch bản | Kết quả text/shot list cho phép xem, chỉnh và xuất sang node nối sau; đầu ra lỗi/rỗng không được phát. | 🟡 |

## F03 — Sinh ảnh AI

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| I01 | Nhập Prompt | Nhập mô tả ảnh; Prompt dưới Node. | 🟡 |
| I02 | Tải ảnh tham chiếu | Upload ảnh từ máy. | 🟡 |
| I03 | Tham chiếu từ Canvas | Chọn ảnh đã có trên Canvas. | 🟡 |
| I04 | Đánh dấu đối tượng | **ẨN THEO YÊU CẦU 2026-11-08.** Không render trên thanh công cụ F03, không có thao tác click; giữ nguyên dữ liệu ảnh và Node cũ. Không đưa I04 trở lại nếu chưa được duyệt. | ⛔ ẨN |
| I05 | Chọn phong cách | Preset phong cách ảnh. | 🔴 |
| I06 | Chọn AI/model/tab | Chọn provider, model và phiên tab hợp lệ. | 🟡 |
| I07 | Tỷ lệ khung hình | Ví dụ 1:1, 9:16, 16:9. | 🟡 |
| I08 | Độ phân giải 1K/2K/4K | Thiết lập chất lượng khi model hỗ trợ. | 🔴 |
| I09 | Số lượng ảnh | Chọn số ảnh đầu ra. | 🔴 |
| I10 | Chỉnh sửa phần tử | **Chỉ khi F03 đã có ảnh kết quả và ảnh đang được chọn:** toolbar nằm phía trên ảnh (ảnh 1, 2026-11-08), bấm **Chỉnh sửa phần tử** → chuyển sang chế độ chọn/chỉnh trực tiếp trên ảnh (ảnh 2), ảnh phủ lớp tối, có thanh riêng với nút Đóng (×), chọn theo điểm/ghim, chọn vùng nét đứt, bút vẽ và Hoàn tác. Không mở Node tạo ảnh mới, không đưa ảnh thủ công vào Prompt. **Khi Node chưa có ảnh:** không hiển thị/không bật I10. Phân biệt các điều khiển chọn vùng *bên trong I10* với nút I04 đã bị ẩn. | 🟡 Đã chốt UX, chưa code |
| I11 | HD / Nâng cấp độ phân giải | **F03 đã có ảnh kết quả và ảnh được chọn** → bấm HD trên toolbar nổi → xuất hiện Node **HD** mới, nối từ ảnh gốc; có bảng thiết lập nâng cấp độ phân giải với **Chọn model/dịch vụ** (ảnh mẫu: Topazlabs), **chế độ/model** (ảnh mẫu: Thông dụng), **hệ số phóng** 2× / 4× / 6× và nút **↑ tạo**. AI xử lý ảnh gốc thành **một ảnh kết quả mới có chất lượng theo thiết lập**; không chỉ kéo giãn ảnh hiển thị. Node HD rỗng có placeholder, không có toolbar kết quả nổi phía trên. Chỉ cho chọn dịch vụ/model có kết nối, nếu thiếu phải thông báo. Chưa code. | 🟡 Đã chốt UX, chưa code |
| I12 | Nhiều góc độ | **F03 có ảnh kết quả và đang chọn:** bấm nút Nhiều góc độ mở bảng **Trình chỉnh sửa nhiều góc độ** ở dưới ảnh (ảnh user 2026-11-08); có preset góc nhìn (Tùy chỉnh, mắt cá, nghiêng, trước nhìn từ trên, trước từ dưới, toàn cảnh từ trên, phía sau), mô hình quả cầu xoay xem hướng camera, thanh trượt xoay ngang/dọc và zoom cảnh, bật/tắt hiển thị Prompt, Đặt lại, nút ↑. Sau khi cài đặt, AI **sinh một ảnh MỚI cùng nhân vật/đối tượng từ ảnh gốc theo góc camera mới**; không chỉ xoay/zoom ảnh sẵn có và không ghi đè ảnh nguồn. | 🟡 Đã chốt UX, chưa code |
| I13 | Phân đoạn lưới | **ẨN THEO YÊU CẦU.** Không hiển thị trong thanh công cụ/menu của F03 kể cả khi đã có kết quả; không kích hoạt công cụ hay tạo kết quả; không xóa dữ liệu ảnh hoặc Node cũ. Không thêm lại khi dựng UI V3 nếu chưa được duyệt. | ⛔ ẨN |
| I14 | Phân tách lớp | **ẨN TOÀN ỨNG DỤNG THEO YÊU CẦU.** Không hiển thị nút/tác vụ Phân tách lớp trên bất kỳ toolbar Node nào, kể cả đã có kết quả. Giữ nguyên dữ liệu. | ⛔ ẨN |
| I15 | Tầm nhìn toàn cảnh 720 độ | **ẨN TOÀN ỨNG DỤNG THEO YÊU CẦU.** Không hiển thị nút/tác vụ 720° trên bất kỳ toolbar Node nào, kể cả đã có kết quả. Giữ nguyên dữ liệu. | ⛔ ẨN |
| I16 | Hơn | **ẨN TOÀN ỨNG DỤNG THEO YÊU CẦU.** Không hiển thị menu Hơn/More trong các toolbar Node. Các chức năng được duyệt khác vẫn có nút riêng, không xóa dữ liệu. | ⛔ ẨN |
| I17 | Nhân bản | Duplicate Node hoặc ảnh theo lựa chọn. | 🟡 |
| I18 | Vẽ/đánh dấu | **F03 đã có ảnh kết quả và đang chọn:** nút biểu tượng nét vẽ trên toolbar nổi mở chế độ đánh dấu trực tiếp lên ảnh, với thanh công cụ nổi có **× thoát, bút vẽ, chọn vùng hình chữ nhật nét đứt, thêm chữ T, chọn màu (ảnh: đỏ), chỉnh cỡ nét bằng slider, hoàn tác, làm lại, Lưu**. Người dùng có thể khoanh/vẽ nét lên ảnh gốc. **Bấm Lưu sẽ mở bảng ghi chú thích** cho phần đã đánh dấu, KHÔNG tự gọi AI hoặc sinh ảnh ngay. Ảnh và mask/nét vẽ là trạng thái thao tác riêng, tránh ghi đè ảnh gốc. | 🟡 Đã chốt UX, chưa code |
| I19 | Tải ảnh | Lưu ảnh kết quả. | 🟡 |
| I20 | Zoom xem ảnh | Mở/thu phóng preview ảnh. | 🟡 |
| I21 | Nút gửi ↑ | Gửi Prompt, spinner, lỗi đỏ. | 🟡 |
| I22 | Thu gọn/mở rộng Prompt | Neo dưới Node, giữ screen-space khi zoom. | 🔴 |

## F04 — Sinh video AI

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| V01 | Nhập Prompt | Mô tả video trong composer. | 🟡 |
| V02 | Tải ảnh/video tham chiếu | Thêm video/ảnh cục bộ. | 🟡 |
| V03 | Tham chiếu Canvas | Nhận ảnh/video từ các Node nối. | 🟡 |
| V04 | Thư viện nhân vật | Chọn nhân vật để tham chiếu. | 🔴 |
| V05 | Công cụ góc máy | Cấu hình ngôn ngữ góc máy. | 🔴 |
| V06 | Chọn AI/model/tab | Provider, model, tab tương ứng. | 🟡 |
| V07 | Tỷ lệ khung hình | Thiết lập tỷ lệ đầu ra. | 🟡 |
| V08 | Thời lượng | Độ dài clip theo model. | 🟡 |
| V09 | Chất lượng video | Cấu hình phân giải/quality. | 🔴 |
| V10 | Ghi hình chuyển động chiều sâu | **F04 đã có video kết quả và đang chọn:** bấm V10 mở một **Node xử lý video mới**, có đường nối từ video nguồn sang khung preview video đầu ra (rỗng trước khi chạy). Bảng nhỏ bên dưới: tiêu đề **Ghi hình chuyển động chiều sâu**, mục **Sự rõ ràng** chọn **480P / 720P**, nút trắng **Xác nhận quá trình chiết xuất**. Dùng video nguồn để tạo **video preview độ phân giải thấp, ưu tiên chủ thể chính và cảm giác chiều sâu/chuyển động**, không ghi đè video nguồn; chờ dịch vụ thật. Theo yêu cầu chung, phần tạo video sẽ cho chọn **AI đã kết nối → model/tab khả dụng** khi tích hợp. | 🟡 Đã chốt UX, chưa code |
| V11 | HD / Nâng chất lượng video | **F04 có video kết quả và đang được chọn:** bấm HD tạo Node **Video HD** mới kết nối từ video nguồn; preview rỗng trước khi xử lý. Bảng dưới Node như ảnh user: **Chọn AI đã kết nối → model/tab thực tế hỗ trợ xử lý video**, độ phân giải **1080P / 2K / 4K**, **chế độ bù khung hình** (mẫu: Không bù khung), **hệ số làm chậm** (mẫu: 1×), chi phí nếu có và nút ↑. AI tạo **video chất lượng cao mới**, không thay hoặc tự động gửi video gốc. Chỉ hiện toolbar kết quả khi đã có video mới và Node được chọn. | 🟡 Đã chốt UX, chưa code |
| V12 | Xóa phụ đề | **F04 đã có video kết quả và được chọn:** bấm Xóa phụ đề → dùng **AI xử lý video nguồn để xóa chữ/phụ đề hiển thị trong khung hình**, sau đó **sinh video kết quả mới** đã xóa phụ đề, giữ nguyên video gốc. Tác vụ chỉ gửi khi người dùng yêu cầu; dùng bộ chọn AI/model/tab C01 và **chỉ AI đã kết nối có khả năng xử lý/xóa phụ đề video** (theo quy tắc chung chọn AI cho tác vụ video), không tạo kết quả giả nếu không có backend phù hợp. **Chưa có ảnh giao diện riêng**, không tự thiết kế thêm menu. | 🟡 Đã chốt chức năng, chưa code |
| V13 | Làm lại đoạn video | **F04 đã có video kết quả và được chọn:** click V13 mở **Node Quay lại cảnh phim / Làm lại đoạn** nhận video nguồn qua dây nối. Có **video player** và **timeline dạng thumbnail chia đoạn**, chọn đoạn cần sửa (ảnh mẫu: video 15 giây, đoạn 00:00–00:05, nhãn 5.0 s, 1/5 phân đoạn). Bên dưới là khung Prompt để yêu cầu AI **chỉnh/tạo lại chỉ phân đoạn đã chọn**, có tham chiếu upload/Canvas/thư viện nhân vật, AI/model/tab video đã kết nối, tùy chọn video và nút ↑. Giữ video gốc và các đoạn không được chọn, không tự làm lại toàn bộ video. | 🟡 Đã chốt UX, chưa code |
| V14 | Tách âm thanh / Tách âm thanh và video | **ẨN THEO YÊU CẦU** (ảnh thanh công cụ video 2026-11-08): không hiển thị mục **Tách âm thanh/video** hoặc menu xổ xuống trong bất kỳ Node nào; không tự kích hoạt tách track, không xóa dữ liệu video/audio cũ. | ⛔ ẨN |
| V15 | Hơn | **ẨN TOÀN ỨNG DỤNG THEO YÊU CẦU.** Không hiển thị menu Hơn/More trong các toolbar Node Video hoặc bất kỳ Node nào. | ⛔ ẨN |
| V16 | Phát/tạm dừng | Player nội bộ. | 🟡 |
| V17 | Tải video | Lưu output hợp lệ. | 🟡 |
| V18 | Zoom xem video | Xem video lớn. | 🟡 |
| V19 | Nút gửi ↑ | Ready/spinner/lỗi đỏ. | 🟡 |
| V20 | Tạo lại video | Chạy lại có chủ đích, không tự rerun. | 🟡 |
| V21 | Thu gọn Prompt | Ẩn/mở khung nhập theo mẫu. | 🔴 |

## F05 — Bàn làm việc của giám đốc

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| D01 | Mở bàn làm việc 3D | **ẨN TOÀN ỨNG DỤNG.** Không hiện nút mở bàn 3D ở F05 hay nơi khác; không xóa cảnh/Node/dữ liệu cũ. | ⛔ ẨN |
| D02 | Nhập mô tả cảnh | Nhập brief scene. | 🟡 |
| D03 | Thêm ảnh tham chiếu | Upload/chọn tham chiếu. | 🟡 |
| D04 | Gửi tạo cảnh ↑ | Gửi Prompt tạo bối cảnh. | 🔴 |
| D05 | Xem không gian 3D | **ẨN TOÀN ỨNG DỤNG theo yêu cầu 2026-11-08.** Không render hành động xem không gian 3D ở F05 hoặc Node bất kỳ có cùng chức năng. Giữ nguyên cảnh/video/tài nguyên đã lưu. | ⛔ ẨN |
| D06 | Điều khiển camera | **ẨN TOÀN ỨNG DỤNG THEO YÊU CẦU 2026-11-08.** Không hiển thị điều khiển camera của bàn đạo diễn 3D trên F05 hoặc Node khác có cùng chức năng. Không xóa dữ liệu/cảnh/project đã lưu. Phân biệt với thiết lập góc máy trong F03/I12 và F04/V05 đã được duyệt (không ẩn các chức năng khác này). | ⛔ ẨN |
| D07 | Chọn góc máy | **GIỮ LẠI — CHỐT DÙNG CHUNG F03/I12 (2026-11-08).** Khi bấm D07 trên F05, mở **đúng giao diện Trình chỉnh sửa nhiều góc độ của F03/I12**: preset góc camera, mô hình quả cầu/orbit, góc ngang/dọc, zoom, reset, nút gửi AI tạo ảnh mới từ góc đã chọn, giữ nguyên ảnh nguồn. Cùng biểu tượng trên Node khác = cùng chức năng, cùng UI, dùng chung component/handler, chỉ AI/model/tab đã kết nối. Đừng tạo phiên bản D07 riêng. D01/D05/D06 vẫn ẩn toàn ứng dụng. | 🟡 Đã chốt dùng chung I12, chưa code V3 |
| D08 | Xuất ảnh từ camera | **Đã xác nhận:** chọn góc máy hiện tại trong F05 — Đạo diễn và **xuất một ảnh mới** tương tự thao tác chụp khung hình, nhưng nguồn là camera/góc nhìn của F05 (không phải video timeline). Không mặc định gọi AI; không thay đổi cảnh gốc. | 🟡 Đã chốt chức năng, chưa code |
| D09 | Thu gọn Prompt | Theo chuẩn Node. | 🔴 |

## F06 — Chỉnh sửa thông minh

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| E01 | Nhận video tham chiếu | Kết nối hoặc tải tệp video. | 🟡 |
| E02 | Nhập lệnh chỉnh sửa | Prompt yêu cầu edit. | 🟡 |
| E03 | Video thuyết minh | **TẠM HOÃN theo lựa chọn số 3 của chủ dự án (2026-11-08).** Không hỏi tiếp, không tự ẩn, chưa chốt giữ hay ẩn; để xác định chức năng sau. | ⏸️ Để làm sau |
| E04 | Quảng cáo hàng loạt | **ẨN TOÀN ỨNG DỤNG theo yêu cầu 2026-11-08.** Không hiển thị nút/preset Quảng cáo hàng loạt trong F06 — Smart Edit hoặc Node khác có cùng chức năng. Không chỉ làm mờ; giữ nguyên workflow/video/dữ liệu cũ. E03 vẫn tạm hoãn (không tự ẩn), E05/E06 chưa chốt. | ⛔ ẨN |
| E05 | Video podcast | Preset edit podcast. | 🔴 |
| E06 | Biên tập tư liệu | Preset cắt clip. | 🔴 |
| E07 | Chế độ chỉnh sửa | Chọn mode phù hợp. | 🔴 |
| E08 | Tỷ lệ khung hình | Thông số xuất. | 🟡 |
| E09 | Thời lượng đầu ra | Thiết lập độ dài. | 🟡 |
| E10 | Nhân bản | Duplicate. | 🟡 |
| E11 | Cắt khung / Lấy ảnh khung hình | **F06 — Smart Edit có video đầu vào và được chọn:** bấm Cắt khung để **lấy khung hình đang chọn từ video và sinh ra một ảnh riêng**. Đây là thao tác trích xuất khung hình, không mặc định gọi AI tạo lại hình ảnh; giữ nguyên video nguồn. Khi có biểu tượng/chức năng giống U21 (R02 video tải lên), dùng chung logic phù hợp. Chưa có ảnh chi tiết phần chọn khung hoặc khu vực cắt, không suy đoán thêm. | 🟡 Đã chốt chức năng, chưa code |
| E12 | Tải video | Lưu output. | 🟡 |
| E13 | Zoom xem video | Preview lớn. | 🟡 |
| E14 | Timeline chuyên dụng | **ẨN THEO YÊU CẦU NGÀY 2026-11-08.** Không hiển thị nút mở editor Timeline chuyên dụng trong **F06 — Smart Edit**, kể cả khi có video kết quả. Không xóa dữ liệu video/Node, không xóa trình phát/tua video thông thường hoặc timeline chọn phân đoạn của F04/V13 vì đây là chức năng khác. | ⛔ ẨN |
| E15 | Nút gửi ↑ | Gửi lệnh edit. | 🔴 |
| E16 | Thu gọn Prompt | Theo mẫu Node. | 🔴 |

## F07 — Sinh âm thanh AI

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| A01 | Nhập Prompt | Mô tả âm thanh. | 🟡 |
| A02 | Tải âm thanh tham chiếu | Tệp/audio mẫu. | 🟡 |
| A03 | Tham chiếu Canvas | Nhận audio/video/text có kiểu. | 🟡 |
| A04 | Âm thanh → Video | **Đã xác nhận 2026-11-08:** Khi bấm A04 trên Node F07 có âm thanh, mở **cùng giao diện Preset — Âm thanh thành Video** như A10 theo ảnh người dùng gửi: audio waveform và ảnh tham chiếu nối vào khung video trống, composer có Prompt, cấu hình tỷ lệ/chất lượng/thời lượng, chọn AI/model/tab đã kết nối và nút ↑. **Dùng chung một màn hình, trạng thái và logic** với A10; không dựng hai UI khác nhau. Giữ nguyên quy tắc ẩn “Hơn” ở mọi Node. | 🟡 Đã chốt UX, chưa code |
| A05 | Chọn AI/model/tab | Provider, model và nơi gửi. | 🟡 |
| A06 | WAV/MP3 | Chọn định dạng đầu ra. | 🟡 |
| A07 | Thời lượng | Độ dài âm thanh. | 🟡 |
| A08 | Giọng nói | Chọn giọng khi có TTS. | 🟡 |
| A09 | Dịch Việt ↔ Anh | Giống T07/S07: **chỉ dịch nội dung Prompt** Việt ↔ Anh, không dịch giao diện. | 🔴 |
| A10 | Cài đặt nâng cao | **Đã xác nhận:** bấm A10 (biểu tượng ba thanh trượt trong F07) mở **giao diện preset Âm thanh → Video** đúng ảnh ngày 2026-11-08: một nhóm trên Canvas gồm audio waveform/nguồn âm thanh, ảnh tham chiếu, preview video, composer nhập lệnh và cài đặt tỷ lệ/chất lượng/thời lượng. Giữ nguyên bố cục mẫu; chỉ chọn AI/model/tab đã kết nối theo C01, không tự thêm nút Hơn đã bị ẩn. **Không suy diễn rằng đã nhìn thấy popup chi tiết sau nút ba thanh trượt trong ảnh**. | 🟡 Đã xác nhận màn hình, chưa code |
| A11 | Nút gửi ↑ | Gửi yêu cầu và trạng thái. | 🔴 |
| A12 | Nghe kết quả | Audio player & waveform. | 🟡 |
| A13 | Thu gọn Prompt | Chuẩn Prompt dưới node. | 🔴 |

## R01 — Ảnh tải lên

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| U01 | Chọn ảnh từ máy | Upload image. | 🟡 |
| U02 | Dán ảnh clipboard | Paste ảnh vào Node hiện chọn. | 🟡 |
| U03 | Hiển thị preview ảnh | Card hiển thị ảnh gốc. | 🟡 |
| U04 | Đổi tên | Tên Node sửa được. | 🟡 |
| U05 | Nhân bản | Duplicate Node. | 🟡 |
| U06 | Tải ảnh | Download media. | 🟡 |
| U07 | Phóng to | Full/zoom preview. | 🟡 |
| U08 | Kết nối sang Node khác | Output image có kiểu. | 🟡 |
| U09 | Thay ảnh | Chọn ảnh khác mà không hỏng dây. | 🟡 |
| U10 | Công cụ ảnh AI (ảnh tải lên) | **ĐÃ XÁC NHẬN:** Khi R01 có ảnh tải lên hợp lệ và Node được chọn, thanh công cụ nổi có **cùng các biểu tượng, giao diện, cách hoạt động như F03 — Sinh ảnh AI đã có ảnh kết quả**. Mọi biểu tượng/chức năng giống nhau phải dùng chung đúng logic (I10 Chỉnh sửa phần tử, I11 HD, I12 Nhiều góc độ, I17 Nhân bản, I18 Vẽ/đánh dấu, I19 Tải ảnh, I20 Zoom và các mục hợp lệ). Các nút I04, I13–I16 đã yêu cầu **ẨN** cũng phải ẩn trong R01 và mọi Node khác. Không xóa ảnh gốc; AI/model/tab chỉ khi tác vụ cần và có kết nối. | 🟡 Đã chốt UX dùng chung, chưa code toàn V3 |

## R02 — Video tải lên

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| U11 | Chọn video từ máy | Upload video. | 🟡 |
| U12 | Hiển thị video | Card preview. | 🟡 |
| U13 | Phát/tạm dừng | Player. | 🟡 |
| U14 | Thanh tua | Scrub timeline. | 🟡 |
| U15 | Âm lượng | Mute/volume. | 🟡 |
| U16 | Đổi tên | Sửa tiêu đề. | 🟡 |
| U17 | Nhân bản | Duplicate. | 🟡 |
| U18 | Tải video | Download. | 🟡 |
| U19 | Phóng to video | Fullscreen/zoom. | 🟡 |
| U20 | Kết nối sang Node khác | Output video có kiểu. | 🟡 |
| U21 | Công cụ video AI (video tải lên) | **R02 đã tải video và được chọn:** toolbar nổi dùng chung F04 gồm Chuyển động sâu, HD, Xóa phụ đề, Làm lại đoạn, **Chụp/Trích khung hình** (biểu tượng camera/khung ngắm ▼), Tải xuống, Xem lớn. Menu camera đúng ảnh: **Chụp khung hình hiện tại**, **Chụp khung hình đầu tiên**, **Trích xuất khung hình cuối cùng**. **Bấm một lựa chọn là xuất ảnh ngay** từ frame tương ứng trong video, giữ **đúng tỷ lệ khung hình và chất lượng/độ phân giải nguồn**. Không cần AI, không cần Prompt hoặc nút gửi; không tăng chất lượng hay thay đổi nội dung. Các mục Tách âm thanh/video, Phân tích từng khung hình và Hơn vẫn ẩn theo yêu cầu. | 🟡 Đã chốt menu + chức năng, chưa code V3 |

## Các quy tắc chung (G01–G11)

| Mã | Nút/chức năng | Yêu cầu |
|---|---|---|
| G01 | Click chọn Node | Một Node được chọn mới có công cụ tương ứng. |
| G02 | Bỏ chọn / click Canvas trống | Ẩn ngay toolbar và khung Prompt theo thiết kế. |
| G03 | Kéo Node | Di chuyển đúng pan/zoom, không kích menu ngoài ý muốn. |
| G04 | Kết nối dây | Dây cong phía sau và cổng dấu +; type-safe; một output tới nhiều Node. |
| G05 | Đổi tên | Giữ tên trong JSON và sau khôi phục. |
| G06 | Xóa | Hỏi xác nhận khi có rủi ro, giữ undo/restore thích hợp. |
| G07 | Zoom Canvas | Card node zoom cùng Canvas. |
| G08 | Composer zoom | Prompt dưới Node giữ kích thước theo màn hình khi zoom Canvas, neo đúng vị trí. |
| G09 | Composer thường ↔ phóng lớn | Một nút icon hai mũi tên chéo: bình thường hiện dưới Node, mở rộng thành vùng soạn lớn nổi trên Canvas rồi thu về; không mất dữ liệu. |
| G10 | Gửi đang chạy | Nút ↑ đổi thành vòng xoay, dừng gửi lặp. |
| G11 | Gửi lỗi | Nút ↑ chuyển đỏ, có thông tin lỗi và cách thử lại. |

## Ghi chú bắt buộc cho F02

1. **S01 dùng ảnh 1 + 2 + 3**: script/từ văn bản và dropdown **Tạo hình ảnh nhân vật / Tạo đồ thị cảnh / Tạo ảnh sản phẩm** + hành động sáng tạo, tải xuống. Đây là toolbar chuyên biệt của Script khi chọn, KHÔNG phải toolbar chỉnh sửa ảnh HD/layers.
2. **S02 dùng ảnh 4 + 5 + 6 + 7**: nhiều ảnh nhân vật -> Script; composer có ảnh tham chiếu, nhập Prompt và chọn từ Canvas, máy tính hoặc kho tài sản.
3. **S03 dùng ảnh 8**: trình soạn bảng phân cảnh nhiều cột và ba bước; không nhầm với S01/S02.
4. **S06/S07/S08** có quy tắc dùng chung F01-T06/T07/T08.
5. Khi chọn ảnh nguồn, thanh công cụ phía trên thuộc **Node Ảnh đang chọn**, không tự gán cho F02.

## Ghi chú T09 (ảnh mới nhất, bổ sung 2026-11-08)

- Chủ dự án đã gửi **thêm ảnh làm chuẩn cho F01-T09** để chốt mở rộng/thu gọn Prompt; dùng ảnh đó thay cho hai lựa chọn A/B mà AI hỏi trước đó.
- Hành vi không được đoán lại: khi porting UI phải đối chiếu trạng thái hiển thị thật với ảnh T09, đặc biệt nút mở rộng của composer, vùng nhập và kích thước khi phóng Canvas.
- Không được khẳng định đã lập trình chỉ vì được bổ sung ảnh.

## Luồng sửa theo thứ tự

1. Xác nhận kiểm kê (tài liệu này), không thay mã runtime.
2. F01 T01–T02–T09 (soạn text, toolbar, composer); kiểm tra click/zoom/lưu, ảnh trước và sau, commit.
3. F01 T03–T05 (nối dữ liệu text -> video/audio và ảnh -> prompt); test graph và chỉ gửi dữ liệu thật.
4. F01 T06–T08 (AI/model/tab, dịch hai chiều, nút ↑ gửi Prompt); test trạng thái lỗi/chạy.
5. F02 S01–S03 (menu kịch bản, nhân vật tham chiếu, bảng phân cảnh), sau đó S04–S10.
6. Các Node còn lại F03, F04, F05, F06, F07, R01, R02: duyệt ảnh/giao diện trước rồi mới cắm nút vào bộ xử lý thật.
7. Cập nhật trạng thái khi **đã sửa và kiểm thử**, ghi commit + ảnh chụp thực tế. Không chèn ảnh giả, không tự gọi AI tính phí.

**Các tình trạng trên GitHub là kiểm kê sơ bộ, KHÔNG kết luận mọi nút màu đỏ hoàn toàn không tồn tại ở module legacy.** Vẫn cần rà kỹ chức năng tương ứng trước mỗi commit triển khai.


## Quy tắc bắt buộc: một chức năng chung cho các nút tương đương

**Chủ dự án xác nhận 2026-11-08:** Các nút có chức năng giống nhau, kể cả thuộc các loại Node khác nhau, **phải dùng chung logic và component khi phù hợp**. Chỉ khác cài đặt về loại dữ liệu, model được hỗ trợ, hoặc định dạng đầu ra. Không tạo các bản sao code có hành vi sai khác.

| Chức năng dùng chung | Các mã nút | Hành vi bắt buộc |
|---|---|---|
| Chọn AI/model/tab | T06, S06, I06, V06, A05 | Chọn provider, sau đó model phù hợp tác vụ và tab/cuộc hội thoại đang đăng nhập; cùng cách lưu/lỗi/chọn lại, không gửi nhầm tab. |
| Dịch hai chiều | T07, S07, A09 | **Chỉ dịch nội dung chữ trong ô nhập Prompt** Việt→Anh / Anh→Việt, không dịch UI và không làm thay đổi nội dung node nguồn; giữ bản gốc để hoàn tác. |
| Gửi Prompt | T08, S08, I21, V19, D04, E15, A11 | Một cơ chế ready/working/error: nền trắng và mũi tên ↑; spinner xoay khi gửi/đang xử lý; đỏ và báo lỗi khi thất bại; không tự chạy do thay nguồn. Task-specific payload theo Node. |
| Thu gọn/mở rộng Prompt | T09, S09, I22, V21, D09, E16, A13 | **Hai ảnh được duyệt:** composer thường dưới Node → click icon hai mũi tên chéo → panel soạn thảo cỡ lớn nổi trên Canvas → click lại thu về; giữ text/thumbnail/model/state. Composer thường không thay đổi size khi zoom Canvas. |
| Thêm tham chiếu | T04, S05, I02, I03, V02, V03, D03, A02, A03, E01 | Một bộ chọn nguồn với các mục phù hợp: Canvas hiện tại, tải cục bộ, kho tài sản/lịch sử; xác minh loại media và thumbnail; lưu node connection/asset ID. |
| Tải kết quả | S01, I19, V17, D08, E12, U06, U18 | Một hành vi tải thống nhất, đuôi file và quyền tải tùy loại media; không tải tài nguyên rỗng/lỗi. |
| Xem/phóng to | I20, V18, E13, U07, U19 | Chung cơ chế preview/lightbox; player video, ảnh và timeline phù hợp media type. |
| Nhân bản | I17, E10, U05, U17 | Sao chép đúng node, metadata và cài đặt, ID mới, giữ dữ liệu và xử lý dây nối theo chính sách clone. |

**Yêu cầu kỹ thuật khi triển khai:** Tách module/helper chung cho hành vi giống nhau; ưu tiên cấu hình theo capabilities của từng Node. Component chia sẻ phải được dùng trên **Canvas thực**, không làm mock. Có test hồi quy đa Node: click, phím, status, chọn tab, save/reload, zoom, invalid media. Không đánh dấu 🟢 trước khi có code và bằng chứng test. Chưa thay đổi runtime trong commit tài liệu này.


## Xác nhận nhóm điều khiển chung — 2026-11-08

**Chủ dự án duyệt 8 nhóm được gom chung logic:** Chọn AI/model/tab; Dịch Prompt; Gửi Prompt; Composer thường/mở rộng; Chọn tham chiếu; Tải kết quả; Xem lớn/Zoom; Nhân bản Node. Chức năng tương ứng phải giống nhau giữa các Node, chỉ khác capability, định dạng tài nguyên, và model/tab có thể dùng.

**Hai ảnh mới của chế độ Composer** (đã nhận trong hội thoại, chưa được đưa vào GitHub):
- **Ảnh 1:** F02 Script card nằm phía trên, **khung Prompt thường** phía dưới, bao gồm nút thêm ảnh tham chiếu, nhập lệnh, bộ chọn model, dịch, năng lượng, nút ↑ gửi và nút phóng ở góc trên bên phải.
- **Ảnh 2:** nhấn nút phóng → khung Prompt mở rộng thành **panel nhập cỡ lớn phủ gần toàn màn hình Canvas**, nút góc phải đổi chức năng thu về khung thường. Đây không phải hành động ẩn hẳn Prompt và không phải chỉ rút thành một dòng. Các dữ liệu và thiết lập vẫn giữ nguyên khi chuyển trạng thái.

**Dịch (T07/S07/A09):** Chỉ dịch nội dung trong textarea/ô Prompt. Có thể dùng chiều Việt → Anh và Anh → Việt, không được tự dịch tên Node, thanh công cụ hay nội dung cả app. Không gửi yêu cầu AI tạo nội dung chỉ vì nhấn nút dịch.

**Gửi Prompt:** vẫn đúng yêu cầu trắng / spinner đang chạy / đỏ khi lỗi; chỉ khi bấm mới thực hiện gửi và không chạy ngầm do kết nối mới.

**Chọn model:** danh sách hiển thị **chỉ AI đã kết nối**, chọn provider rồi chọn model hoặc tab tương ứng trong cùng picker tối màu như ảnh đã gửi. Model chưa khả dụng không được thể hiện là chọn được.

**Được duyệt khác không có nghĩa đã code:** 8 nhóm có **đặc tả được xác nhận**, nhưng trạng thái thực tế trên `main` còn vàng/đỏ như bảng trên. Việc triển khai giao diện và xử lý nút phải có PR/commit mã và kiểm thử thật trước khi chuyển xanh. Không có thay đổi runtime trong commit tài liệu này.


## Bổ sung đã xác nhận trực tiếp từ chủ dự án — 2026-11-08

- **F01/T04 (Ảnh → suy ngược Prompt):** Khi nhận nhiều ảnh, tạo **một Prompt riêng cho từng ảnh**; không tự gộp tất cả ảnh vào một Prompt. Cần giữ liên kết Prompt ↔ ảnh nguồn; nếu UI kết quả chưa rõ thì xin duyệt trước khi triển khai.
- **C05 (Kho tài sản):** Chỉ sử dụng **một kho tài sản chung cho toàn ứng dụng**, chia thành các **khu nhỏ theo loại tài nguyên** (ví dụ ảnh, video, âm thanh, nhân vật, bối cảnh, sản phẩm, hiệu ứng, mẫu). Mọi Node dùng chung một bộ chọn tài nguyên, tự lọc loại hợp lệ theo cổng đầu vào; không tự tạo 9 kho riêng biệt.
- Các công cụ riêng còn chờ giải thích: F02 S01/S03; F03 I05/I10–I12/I18 (I04, I13–I16 đã được yêu cầu ẩn); F04 V05/V10–V13 (V14/V15 đã ẩn); F05 D07–D08 (D01/D05/D06 đã ẩn); F06 E03–E07/E11 (E14 đã ẩn); F07 A04/A10; R01 U10; R02 U21. **Các hình minh họa trợ giúp là đề xuất ý nghĩa thao tác, không phải chức năng đã được xác nhận hoặc đã triển khai.** Chủ dự án sẽ xem từng hình rồi chốt lại.


### Quyết định giao diện — I04 (2026-11-08)

Chủ dự án yêu cầu **ẩn nút I04 — Đánh dấu đối tượng** khỏi **F03 — Sinh ảnh AI**. Không hiển thị I04 trong toolbar hay menu F03, không thêm chức năng giả cho nút này, không xóa dữ liệu Node/ảnh đã lưu. Mã `app.js`, `app.html` và `node-common-actions.js` ở trạng thái hiện tại chưa có nút I04 được render; vì thế thay đổi này là **quyết định UI đã chốt và tránh tái thêm trong V3**, không phải bằng chứng đã hoàn thành toàn bộ F03.


### Quyết định giao diện — I10 Chỉnh sửa phần tử (2026-11-08)

Người dùng gửi **hai ảnh chụp giao diện thật** và xác nhận trạng thái:

1. **F03 chưa có ảnh kết quả:** I10 không xuất hiện, nên không yêu cầu người dùng tìm nút trong Node rỗng. Bảng thông tin/nút của Node trống thuộc trạng thái khác, không đồng nhất với giao diện công cụ ảnh thành phẩm.
2. **F03 đã có ảnh và ảnh đang được chọn:** thanh công cụ nổi ngang phía trên ảnh có **Chỉnh sửa phần tử** ở đầu trái, kế đó HD và Nhiều góc độ; các nút Phân đoạn lưới, Phân tách lớp, Toàn cảnh 720° và Hơn đã bị yêu cầu ẩn. Ảnh nguồn vẫn được giữ.
3. Bấm **Chỉnh sửa phần tử** thì toolbar được thay thành toolbar edit nhỏ: **× Chỉnh sửa phần tử | ghim/điểm chọn | chọn vùng nét đứt | bút tự do | hoàn tác**. Ảnh bên dưới bị phủ lớp tối, có hướng dẫn chọn đối tượng cần sửa. **Không mở Node mới** và **không tự chuyển sang giao diện composer chưa có ảnh**.
4. Quy tắc UI toàn ứng dụng: **chỉ khi Node đã có kết quả VÀ đang được chọn** mới hiện toolbar nổi ở trên. Node chưa có kết quả: **không hiện toolbar**, kể cả khi click chọn; không tự nổi khi hover. I04 vẫn bị ẩn như một nút độc lập; các công cụ chọn/đánh dấu *bên trong chế độ I10* vẫn giữ nguyên.
5. **Chưa xác nhận** cách áp dụng AI sau khi đánh dấu/chọn vùng và kết quả sau khi sửa. Không tự suy ra là lập tức gửi prompt hoặc tạo ảnh mới; sẽ hỏi riêng khi tới bước xử lý. **Chưa có mã tính năng I10 trong ứng dụng**, tài liệu không được hiểu nhầm là hoàn thành code.

**Hướng dẫn hỏi user từ nay:** luôn nêu **Node + mã nút + tên nút + trạng thái “chưa có kết quả / đã có kết quả” + ảnh khi click cần xem**; chỉ hỏi một nút tại một thời điểm.


### 2026-11-08 — I10 ảnh bổ sung + quy tắc toolbar toàn Node

**Ảnh mới do chủ dự án cung cấp:** Sau khi mở F03/I10 **Chỉnh sửa phần tử** trên ảnh đã có kết quả, người dùng chọn/đánh dấu vùng cần sửa và sử dụng **ô Prompt để mô tả thay đổi**. Đây là quy trình **ảnh kết quả → chọn vùng → nhập yêu cầu chỉnh sửa**, không phải chuyển sang một Node tạo ảnh trống. Không suy diễn vị trí xuất ảnh sau khi gửi; chưa có bằng chứng kiểm thử thật AI. Chưa triển khai UI đánh dấu I10.

**Quy tắc chung bắt buộc trên F01–F07 và R01–R02:**
- **Chưa có kết quả:** tuyệt đối **không có thanh công cụ nổi phía trên**, dù Node được click/chọn. Node vẫn có thể có nút nhập, Prompt hoặc nút tạo riêng bên dưới.
- **Đã có kết quả nhưng chưa chọn Node:** không hiện thanh công cụ nổi.
- **Đã có kết quả và đang được chọn Node:** mới hiện thanh công cụ nổi tương ứng loại nội dung của Node.
- Click nền Canvas/bỏ chọn phải tắt toolbar ngay, không hiển thị trên hover. Không nhầm nút thường trong Prompt với toolbar nổi.

**Thay đổi mã ngày 2026-11-08:** `node-common-actions.js` thêm điều kiện `hasResult` để chỉ tạo toolbar nổi khi có kết quả, `app.js` truyền kết quả dựa trên media/tài liệu script/kết quả AI. Có bài kiểm thử mới trong `tests/desktop-node-common-controls.test.cjs`. Đây là quy tắc được áp dụng trên bộ công cụ chung hiện có; 9 Node V3 chưa triển khai đủ nên chưa xem là xong toàn bộ.


### Quyết định giao diện — F03/I11 HD (2026-11-08)

**Ảnh mẫu mới:** người dùng gửi ảnh Node F03 có ảnh thành phẩm bên trái kết nối bằng dây tới Node **HD** chưa có kết quả bên phải; bên dưới Node HD là bảng **高清放大** (Nâng cấp độ phân giải cao). Chữ trên ảnh: model/provider **Topazlabs**, model/chế độ **通用** (Thông dụng), nút hệ số **2 / 4 / 6**, hiển thị chi phí dự kiến và nút gửi **↑**. Cần Việt hóa nhãn trong ứng dụng nhưng giữ layout sát ảnh. Không gán mặc định Topazlabs hoặc một API cụ thể nếu chưa thực sự kết nối và hỗ trợ.

**Chức năng người dùng xác nhận:** I11 yêu cầu AI tạo **ảnh nâng chất lượng mới** từ ảnh nguồn với cài đặt đã chọn, không đơn thuần resize ảnh. Mỗi lần bấm gửi là tác vụ có chủ đích, trạng thái chờ/chạy/lỗi/kết quả; ảnh mới hiển thị ở Node HD, có thể nối tiếp Node khác, không ghi đè ảnh gốc. Thanh công cụ nổi trên kết quả tuân thủ quy tắc chung: chỉ xuất hiện khi **đã có kết quả và được chọn**.

**Trạng thái:** chỉ ghi đặc tả, chưa tạo node xử lý upscale hay nối dịch vụ thật. **Nút tiếp theo chờ user giải thích: F03/I12 — Nhiều góc độ; trạng thái ảnh đã có kết quả và được chọn.**


### Quyết định giao diện — F03/I12 Nhiều góc độ (2026-11-08)

**Nguồn:** ảnh chụp thực tế do chủ dự án gửi (chưa nhập file vào repo). Điều kiện mở: Node **F03 — Sinh ảnh AI đã có ảnh kết quả và được chọn**, click **I12 — Nhiều góc độ** ở thanh công cụ nổi phía trên kết quả. Node trống không có toolbar nổi.

**Bảng nổi phía dưới ảnh** có tiêu đề **Trình chỉnh sửa nhiều góc độ**, nút × đóng. Các preset lần lượt: **Tùy chỉnh, Góc mắt cá, Góc nghiêng, Góc trực diện từ trên, Góc trực diện từ dưới, Toàn cảnh từ trên, Góc nhìn phía sau**. Bên trái là **bộ điều khiển 3D dạng quả cầu/dây lưới** với ảnh xem trước và các mũi tên thay đổi hướng; bên phải là **Xoay ngang (°), Xoay dọc (°), Thu/phóng cảnh (cỡ cảnh)**. Có công tắc Prompt, nút **Đặt lại thông số**; hàng dưới có chỉ báo chi phí và nút **↑** gửi.

**Chức năng đã được người dùng xác nhận:** sau khi lựa chọn camera và thiết lập, AI **tạo ra ảnh kết quả khác với cùng nhân vật/đối tượng của ảnh gốc** nhưng góc máy theo tham số mới. Không chỉ thao tác CSS xoay ảnh cũ; ảnh gốc vẫn được giữ nguyên. Khi triển khai, chỉ dùng AI/provider thực tế hỗ trợ image-to-image / đổi góc nhìn, không mô phỏng kết quả nếu không có model đã kết nối. Kết quả mới phải có nguồn gốc từ ảnh tham chiếu và có trạng thái chạy/lỗi/hoàn tất.

**Trạng thái:** mới ghi đặc tả, **chưa triển khai mã**. **Cập nhật:** I13–I16 — Phân đoạn lưới, Phân tách lớp, Toàn cảnh 720° và Hơn đã được chủ dự án yêu cầu **ẩn trên tất cả Node**; không cần hỏi ảnh hay triển khai. Nút tiếp theo cần giải thích: **F03 — Sinh ảnh AI / I18 — Vẽ/đánh dấu**, trạng thái **đã có ảnh kết quả và đang chọn**.


### Quyết định — F03/I13 Phân đoạn lưới (2026-11-08)

Chủ dự án yêu cầu **ẩn nút I13 — Phân đoạn lưới**, thuộc F03 — Sinh ảnh AI. Không hiện ở toolbar trên ảnh đã có kết quả, không có menu con và không hỏi thêm đặc tả. Quyết định này tương tự I04 đã ẩn, nhưng áp dụng riêng I13. Giữ nguyên dữ liệu, kết quả và đồ thị Node hiện có. Nếu sau này UI V3 thêm thanh công cụ ảnh, phải loại I13 khỏi danh sách nút hiển thị. Không đánh dấu là đã hoàn thành tính năng I13.


### Quyết định toàn cục — Ẩn 4 mục trên MỌI thanh công cụ Node (2026-11-08)

**Chủ dự án gửi ảnh chụp 4 mục liền nhau trong thanh công cụ ảnh và ra lệnh “ẩn hết những nút này đi nhé (ở tất cả các nút)”.** Ảnh có tên: **Phân đoạn lưới (#), Phân tách lớp (layers), Tầm nhìn toàn cảnh 720 độ, Hơn (▼/▲)**.

**Phạm vi bắt buộc:** áp dụng cho toolbar, menu mở rộng và danh sách action trên **mọi loại Node F01–F07 và R01–R02** nơi những action này xuất hiện; **không chỉ F03**. Không được hiển thị các mục trên trong trạng thái đã chọn/có kết quả. Không thêm lại các nút đó khi xây lại toolbar dùng chung V3. Giữ nguyên các nút đã duyệt còn lại (**Chỉnh sửa phần tử, HD, Nhiều góc độ, Tải kết quả, Xem lớn/Zoom...**); không xoá kết quả, asset, cấu trúc graph hay thao tác của một menu khác không cùng ý nghĩa.

**Các mã bị ẩn:** F03 `I13`, `I14`, `I15`, `I16`; F04 `V15` (Hơn). Các nút F03 `I04` (Đánh dấu đối tượng) và F05 `D01` (Mở bàn 3D), `D05` (Xem không gian 3D), F06 `E14` (Timeline chuyên dụng), F04 `V14` (Tách âm thanh/video) đã được yêu cầu ẩn, giữ nguyên quyết định. Nếu có tên khác nhưng cùng chức năng trong node upload/khác, cũng phải ẩn.

**Trạng thái repo:** tìm trong `app.js`, `app.html`, `node-common-actions.js`, `compact-toolbar.js`: chưa có mã hiển thị các action này trong UI legacy hiện tại. Vì vậy đợt này lưu **đặc tả ẩn và bài kiểm thử chống thêm lại**, không nhận là đã hoàn thành toàn bộ giao diện V3 hay thử được thao tác xóa nút trên bản đang chạy. Các media và nút còn lại không bị đổi.


### Quyết định giao diện — F03/I18 Vẽ/đánh dấu (2026-11-08)

**Ảnh tham chiếu mới:** chủ dự án gửi màn hình ảnh nhân vật 3 góc, trên ảnh đã vẽ nét màu đỏ khoanh quanh nhân vật ở giữa. Ở phía trên ảnh là toolbar đen nền bo tròn: **× (thoát), bút (đang chọn), chọn vùng chữ nhật nét đứt, T (chữ), màu nét hiện tại đỏ, slider độ dày nét, hoàn tác, làm lại, nút Lưu trắng phía phải**.

**Thao tác đã chốt:** chỉ hiển thị công cụ này khi Node F03 **đã có ảnh kết quả và đang được chọn**; click I18 mở chế độ vẽ nét/đánh dấu trực tiếp lên ảnh. Khi click **Lưu**, app **mở bảng nhập ghi chú/chú thích**, không tự gọi AI hay tạo ảnh mới. Không nhầm với I04 — Đánh dấu đối tượng đã bị ẩn, cũng không nhầm với I10 — Chỉnh sửa phần tử có chế độ chọn vùng cho AI. Ảnh gốc giữ nguyên cho tới khi có một thao tác lưu/kết xuất được xác nhận rõ.

**Đã chốt thêm:** Sau khi bấm **Lưu**, mở **một cửa sổ nhỏ có nền vàng để người dùng nhập văn bản ghi chú/chú thích**. Không phải editor chiếm toàn màn hình, không tự gọi AI, không tự sinh ảnh. Chưa có yêu cầu chi tiết về nút phụ hay nơi lưu ghi chú nên không tự ý thiết kế thêm.

**Trạng thái:** chốt phần hành vi và toolbar, chỉ lưu tài liệu; **chưa code I18**, không tạo preview giả.


### Quyết định giao diện — F04/V10 Ghi hình chuyển động chiều sâu (2026-11-08)

**Ảnh mới do chủ dự án cung cấp:** video nguồn đã có kết quả bên trái nối sang một **Node đầu ra chưa có kết quả** ở bên phải. Node bên phải có thẻ preview video tối với biểu tượng Play (chưa có video được chiết xuất). Bảng cài đặt nổi dưới Node bên phải với tiêu đề **Ghi hình chuyển động chiều sâu**, dòng **Sự rõ ràng**, lựa chọn **480P** hoặc **720P**, nút trắng **Xác nhận quá trình chiết xuất**. Chú ý **không có toolbar nổi kết quả ở Node bên phải khi chưa xử lý xong**.

**Ý nghĩa tính năng người dùng đã chốt:** Từ video nguồn hiện có, yêu cầu AI xử lý để tạo **video mới chất lượng preview thấp** nhằm làm rõ chuyển động có chiều sâu, giữ trọng tâm vào nhân vật/chủ thể chính. Đây là một tác vụ tạo/xử lý thật, không phải chỉ thay đổi CSS, báo hoàn thành giả hoặc phát lại video gốc. Sau khi xác nhận, phải chạy AI/provider đã kết nối (hoặc thông báo khi không có engine); lưu output riêng và giữ video nguồn. Những kỹ thuật kiểu parallax/depth chỉ là khả năng triển khai, **không được coi là lựa chọn trong giao diện** nếu ảnh không có.

**Chọn AI/model/tab:** người dùng đã yêu cầu mọi công cụ tạo video có **bộ chọn AI đã kết nối → model/tab phù hợp để làm video**. Bảng V10 trong ảnh chưa thể hiện dropdown đó; khi triển khai, áp dụng bộ chọn dùng chung C01 mà không tự suy đoán vị trí/nội dung thêm vào phần hình mẫu. Không hardcode danh sách nhà cung cấp/chỉ số dịch vụ giả.

**Độ phân giải:** 480P và 720P là hai mức lựa chọn trong ảnh; mặc định ảnh thể hiện 480P đang được chọn. Không tự thêm 1080P/4K vào bảng V10 nếu chưa được duyệt.

**Trạng thái:** **đã nhận và hiểu ảnh + chức năng**, **chưa code V10**. Nút tiếp theo cần giải thích **F04 — Sinh video AI / V11 — HD**, trạng thái **đã có video kết quả và đang chọn**, cần ảnh sau khi nhấn.


### Quyết định giao diện — F04/V11 HD nâng cấp video (2026-11-08)

**Ảnh tham chiếu mới:** video nguồn bên trái nối dây đến Node “高清 (1080P)” bên phải chưa có kết quả, có ô preview trống và bảng “视频高清” ngay bên dưới. Bảng cấu hình gồm **model/provider** (ảnh ví dụ Topazlabs), lựa chọn **1080P / 2K / 4K**, **bù khung hình** (mẫu: Không bù khung), **hệ số làm chậm** (mẫu: 1×), chỉ báo chi phí, nút **↑** để chạy.

**Chức năng đã xác nhận:** nâng chất lượng video nguồn và tạo ra **video kết quả mới** theo thiết lập, không ghi đè bản gốc; không xem việc chỉ thay thuộc tính hiển thị/kích thước video là xử lý HD. Nếu AI/provider không hỗ trợ một độ phân giải hay tùy chọn thì vô hiệu hóa/giải thích, không tạo kết quả giả.

**Yêu cầu bổ sung mới nhất:** người dùng muốn **được chọn AI rồi chọn model/tab trong chính V11**. Sử dụng **cùng bộ chọn C01**, chỉ hiển thị provider **đã kết nối** và model/tab phù hợp với tác vụ **nâng cấp video**. Chọn xong giữ nguyên toàn bộ cấu hình và video nguồn, bấm ↑ gửi tới lựa chọn thực tế. Tên Topazlabs ở ảnh chỉ là ví dụ của màn hình nguồn, **không mặc định là đã tích hợp Topazlabs**. UI phải bám ảnh gốc, thêm chọn AI/tab trong vùng chọn model mà không thay toàn bộ bố cục.

**Trạng thái:** đã chốt đặc tả, **chưa triển khai runtime V11**. Nút tiếp theo cần hỏi từng cái: **F04 — Sinh video AI / V12 — Xóa phụ đề**, trạng thái **đã có video kết quả và đang được chọn**.


### Quyết định giao diện — F04/V12 Xóa phụ đề (2026-11-08)

**Người dùng giải thích:** “là nút gửi cho AI và yêu cầu AI xoá phụ đề thôi, sinh ra video kết quả thôi”. Vì vậy V12 là **tác vụ AI xử lý video đã có**, không phải nút bật/tắt hiển thị chữ trong trình phát hay sửa metadata phụ đề. Đầu ra là **video kết quả mới**, giữ nguyên bản gốc. Chưa cần đề xuất giao diện phụ phức tạp khi user chưa gửi ảnh. Việc chọn AI/model/tab phù hợp lấy từ quy tắc chung của các nút tạo/xử lý video đã được người dùng chốt; chỉ liệt kê AI thật đã kết nối và có khả năng làm tác vụ này, không tự nhận mọi model video đều có tính năng xóa phụ đề.

**Trạng thái:** mới chốt chức năng, **chưa triển khai AI processing hoặc chụp screenshot app thật**. Nút tiếp theo hỏi từng cái: **F04 — Sinh video AI / V13 — Làm lại đoạn video**, ở trạng thái **video đã có kết quả và Node đang được chọn**.


### Quyết định giao diện — F04/V13 Làm lại đoạn video (2026-11-08)

**Ảnh gốc do chủ dự án gửi:** Node video nguồn (bên trái) nối dây vào Node “Video Node 8 - Quay lại cảnh phim” (bên phải). Node bên phải có video player phát video gốc, dưới player là dải thumbnail thời gian/chia đoạn; phân đoạn được chọn có **viền xanh** và nhãn thời lượng (ảnh mẫu **5.0s**, **00:00–00:05**, video tổng **0:15**, chỉ báo **1/5 phân đoạn**). Có hướng dẫn bấm chuột để chọn/chụp phân đoạn mới. Bên dưới là composer tối với nút **Tải lên, Tham khảo Canvas, Thư viện nhân vật**, thumbnail video tham chiếu, dòng hiển thị clip và time range đang chỉnh, bộ chọn model và cài đặt video, dịch, nút gửi ↑.

**Chức năng người dùng xác nhận:** chọn **một đoạn cụ thể** trên timeline, nhập yêu cầu thay đổi đoạn đó rồi gửi AI **làm lại riêng phân đoạn được chọn**. Trước khi gửi phải có video nguồn, time range được chọn và Prompt; không tự sửa tất cả đoạn. Không tự chạy khi bấm chọn đoạn; chỉ gửi khi bấm ↑. Dùng bộ chọn AI → model/tab đã kết nối, hỗ trợ tác vụ video; giữ video nguồn và các đoạn chưa được chỉnh. Kết quả nên được giữ để xem/ghép lại, nhưng chưa có ảnh bước ghép cuối nên không tự thiết kế workflow xuất video hoàn chỉnh.

**Trạng thái:** đặc tả được chốt theo ảnh; **chưa lập trình V13 và chưa kiểm thử AI xử lý đoạn**. **Cập nhật:** V14 — Tách âm thanh/video đã được chủ dự án yêu cầu ẩn, không cần hỏi thêm. Nút tiếp theo cần giải thích: **F06 — Chỉnh sửa thông minh / E03 — Video giải thích**, ở trạng thái Node chưa có kết quả hoặc chưa có video đầu vào.


### Quyết định giao diện — Ẩn nhóm nút video: Tách âm/video · Phân tích từng khung hình · Hơn (2026-11-08)

**Ảnh mẫu mới:** ảnh chụp một phần thanh công cụ của Node đã có video; ba nhóm hiển thị liền nhau bằng tiếng Trung: **分离音视频** (Tách âm thanh và video, có menu xổ xuống), **逐帧拉片** (Phân tích/tách cảnh từng khung hình, biểu tượng cuộn phim và dấu màu vàng), **更多** (Hơn, có menu xổ xuống). Chủ dự án yêu cầu: **“ẩn nhóm nút này đi nhé”**.

**Quy tắc:** không render 3 mục trên trong thanh công cụ Node Video hay bất kỳ Node khác có action trùng tên/chức năng. Không chỉ disable hoặc đổi màu; phải **không hiện** ở cả chế độ có kết quả + Node đang chọn. Không hỏi tiếp user cách dùng những mục đã bị ẩn. Không xóa file video, audio, kết quả hay đồ thị cũ. **Hơn** trước đó đã ẩn toàn ứng dụng (V15 và I16).

**Mapping kiểm kê:** V14 = Tách âm/video → ⛔ ẨN; V15 = Hơn → giữ ⛔ ẨN. “Phân tích/tách cảnh từng khung hình” **chưa được gán mã riêng trong danh sách 122 nút**, nhưng cũng ⛔ ẨN theo lệnh người dùng; không tự thêm mã mới hoặc bật lại. Giữ nguyên các nút AI video đã duyệt: V10 Chuyển động sâu, V11 HD, V12 Xóa phụ đề, V13 Làm lại đoạn.

**Kiểm tra source lúc ghi yêu cầu:** hiện chưa có các nút này trong `app.js`, `app.html`, `node-common-actions.js`, `compact-toolbar.js` ở nhánh `main`; yêu cầu được ghi thành quy tắc thiết kế và bảo vệ bằng test cho các lần sửa UI V3. Không báo đã xóa công cụ trên một bản ứng dụng chưa được commit lên GitHub.


### 2026-11-08 — Ảnh F07 đã xác nhận là màn hình mở từ A10

Người dùng được hỏi **F07 — A10 (Cài đặt âm thanh nâng cao, biểu tượng ba thanh trượt)** và gửi ảnh có tiêu đề **“预设 - 音频生视频” (Preset — Sinh video từ âm thanh)**. Ảnh cho thấy: Node waveform âm thanh 0:03 và ảnh nguồn được nối vào Node preview video trống; composer bên dưới có nút **Upload, Tham khảo Canvas, Đánh dấu, Thư viện nhân vật, Hơn**, thumbnail ảnh/audio (chưa biết thao tác chi tiết), Prompt tạo video dựa vào âm thanh, chọn cấu hình 16:9, 720P, 5 giây, dịch, biểu tượng **ba thanh trượt** cạnh nút gửi ↑. **Ảnh KHÔNG cho thấy menu/bảng popup sau khi bấm biểu tượng ba thanh trượt**, vì thế chưa thể xác nhận cấu hình bên trong A10. Bốn chữ “Hơn” trong ảnh là thiết kế nguồn đã được chủ dự án yêu cầu ẩn toàn cục, **không được tự thêm lại**.

**Chủ dự án xác nhận:** bấm **F07/A10 — Cài đặt nâng cao** mở màn hình preset audio → video như ảnh. **Sau đó xác nhận thêm F07/A04 — Âm thanh → Video cũng mở chính màn hình này**. Không tạo hai giao diện hoặc hai logic khác nhau. Ảnh không thể hiện popup thông số nhỏ đã xổ ra, vì thế không bịa thêm danh sách tham số. **Mới chốt yêu cầu, chưa lập trình A04/A10**.


**Xác nhận hợp nhất 2026-11-08:** **Cả A10 và A04** đều mở đúng giao diện workflow **Âm thanh → Video** từ ảnh mẫu; chia sẻ cùng UI và logic. Đây là đặc tả, chưa phải mã đã chạy.


### Quyết định dùng chung — F07/A04 và F07/A10 (2026-11-08)

Người dùng xác nhận riêng **A04 — Âm thanh → Video** là **giống A10 — Cài đặt nâng cao** khi bấm, cùng mở giao diện **Preset — Âm thanh thành Video** từ ảnh đã gửi: nguồn âm thanh waveform, ảnh tham chiếu, preview video, composer, bộ chọn AI/model/tab hỗ trợ video, thông số tỷ lệ/phân giải/thời lượng, nút ↑. **Hai lối vào cùng một giao diện và cùng một logic**, không copy hai bộ xử lý; không bật lại menu “Hơn” đã được yêu cầu ẩn. Chỉ hiển thị toolbar nổi khi Node có kết quả và đang được chọn.

**Trạng thái:** đặc tả đã chốt, **chưa code** A04/A10. Câu hỏi tiếp theo cho người dùng khi sẵn sàng: **R02 — Node Video tải lên, U21 — Công cụ video AI**; cần xác nhận dùng thanh công cụ giống F04 hay có điểm khác. Trạng thái ảnh/video **đã được tải lên và Node đang được chọn**.


### Quyết định giao diện — R02/U21 Công cụ video AI trên video tải lên (2026-11-08)

**Ảnh từ người dùng:** video dọc đã tải lên (có player/timeline/âm lượng trong Node) và được chọn; một **thanh công cụ nổi** màu tối, bo tròn hiển thị phía trên. Đây là **R02 — Node Video tải lên**, mã **U21**, không phải video tạo bằng AI F04. Tệp đã tải lên thành công được coi là **đã có kết quả/media hợp lệ** cho quy tắc hiện toolbar; không cần AI tạo video mới trước khi hiển thị. Khi click nền Canvas/bỏ chọn thì ẩn.

**Các nút giữ chung với F04** theo thứ tự trái sang phải trên ảnh: **Chuyển động sâu**, **HD/nâng cấp video**, **Xóa phụ đề**, **Làm lại đoạn**. Ở phía phải còn **nút Chụp/Trích khung hình** (camera/khung ngắm ▼; đã xác nhận menu), **Tải xuống**, **Xem lớn**. Các tác vụ AI tương đồng phải dùng chung component và luồng xử lý F04, chỉ AI/model/tab đã kết nối và hỗ trợ tác vụ, không mock kết quả. Giữ video tải lên nguyên bản.

**Ba mục PHẢI ẨN mặc dù hiện trong ảnh gốc:** **Tách âm thanh/video (V14)**, **Phân tích từng khung hình**, **Hơn (V15)**. Các lệnh ẩn đã chốt có ưu tiên hơn việc sao chép nguyên thanh toolbar screenshot. Không xoá dữ liệu/media.

**Trạng thái:** đã xác nhận menu nút camera và chức năng trích frame, **chưa lập trình toolbar V3 R02**. Không hỏi lại ý nghĩa nút camera.


### Quyết định mới — R02/U21 Chụp/Trích khung hình video (2026-11-08)

**Ảnh menu do người dùng gửi:** nút camera/khung ngắm (có mũi tên xổ xuống), ngay trước Tải xuống/Xem lớn, mở ba lựa chọn theo thứ tự:

1. **Chụp khung hình hiện tại** — lấy frame tại thời điểm player đang đứng.
2. **Chụp khung hình đầu tiên** — lấy frame đầu tiên của video.
3. **Trích xuất khung hình cuối cùng** — lấy frame cuối của video.

**Xác nhận hành vi:** khi chọn một mục thì **ứng dụng xuất/sinh một ảnh từ khung hình video ngay lập tức**, **cùng khung hình (tỷ lệ, bố cục) và chất lượng/độ phân giải của video nguồn**. Không phát lệnh tạo ảnh AI, không mở Prompt, không cần model/tab và không tự nâng cấp hình. Giữ nguyên video gốc. Người dùng cung cấp thêm ảnh minh họa đầu ra sau khi làm rõ hành vi. Đích lưu/đặt Node của ảnh mới chỉ chốt khi ảnh minh họa thể hiện rõ; không phỏng đoán nếu chưa xác minh. Lúc hiện chỉ có **đặc tả**, chưa lập trình tính năng.


### Quyết định dùng chung biểu tượng — R01/U10 ↔ F03 và mọi Node (2026-11-08)

Chủ dự án xác nhận rõ: **“đúng rồi đó, biểu tượng giống thì chức năng giống nhau.”** R01 — **Node Ảnh tải lên / U10 — Công cụ ảnh AI** dùng **chính toolbar và cách hoạt động** đã chốt cho F03 — **Node Sinh ảnh AI sau khi có kết quả**. Khi có ảnh tải lên thành công **và** Node được chọn mới hiện toolbar; khi bỏ chọn thì ẩn. Nút giống về biểu tượng/tên trên các Node phải dùng lại một component và một handler thực tế, không có hai cách hiểu/luồng chạy khác nhau. Khi F03 có thao tác AI cần model/tab, R01 sử dụng cùng bộ chọn AI đã kết nối; các hành động không cần AI như tải ảnh/zoom không yêu cầu model.

**Loại trừ trên mọi toolbar:** F03/I04 — Đánh dấu đối tượng độc lập; I13 — Phân đoạn lưới; I14 — Phân tách lớp; I15 — Toàn cảnh 720°; I16/V15 — Hơn; cùng các nút đã yêu cầu ẩn khác. Không đưa lại chỉ vì ảnh tham chiếu cũ có biểu tượng đó. Không xóa ảnh tài nguyên gốc hoặc thay thế Node đã lưu.

**Trạng thái:** chốt đặc tả dùng chung; **chưa triển khai đầy đủ UI R01/U10 bản V3**. Nút tiếp theo có thể hỏi riêng: **F06 — Smart Edit / E11 — Cắt khung**, trạng thái có video đầu vào và đã chọn Node; cần ảnh khi bấm.


### Quyết định — F06/E11 Cắt khung (2026-11-08)

Chủ dự án trả lời: **“nó chỉ cắt khung hình đó thôi, và sinh ra ảnh.”** Đây là công cụ chuyển **khung hình được chọn của video** thành **một ảnh kết quả riêng**, không phải preset edit dài hay yêu cầu AI sửa toàn bộ video. Giữ nguyên video gốc. Mặc định đây là thao tác trích hình ảnh; không gọi AI nếu chỉ cần lấy frame. Chỉ hiển thị công cụ ngữ cảnh khi đã có video và Node được chọn, theo quy tắc chung. Nếu cùng biểu tượng/hành vi với R02/U21, tái sử dụng handler thay vì copy code.

**Chưa có ảnh xác nhận:** giao diện chọn frame/tọa độ crop hoặc Node chứa ảnh mới sau thao tác; không thêm UI phụ ngoài yêu cầu. **Trạng thái:** đã hiểu chức năng, chưa code E11. **Cập nhật:** E14 — Timeline chuyên dụng đã được chủ dự án yêu cầu **ẩn**, không hỏi tiếp.


### Quyết định giao diện — F06/E14 Timeline chuyên dụng (2026-11-08)

Chủ dự án trả lời **“ẩn cái này đi nhé”** khi được hỏi về **E14 — Timeline chuyên dụng**, thuộc **F06 — Chỉnh sửa thông minh (Smart Edit)**. **Ẩn nút E14 hoàn toàn** khỏi Node F06 trong cả trạng thái trống và có video, không mở giao diện Timeline chuyên dụng và không yêu cầu ảnh mô tả nữa.

**Phạm vi chính xác:** chỉ nút **E14** trong F06, **không ẩn/chặn thanh tua video** (U14), **không xóa Node timeline legacy** có sẵn ở repo, **không xóa timeline chọn đoạn** dùng cho F04/V13 vì đây là các chức năng khác đã được xác nhận. Giữ dữ liệu/project cũ. Kiểm tra hiện trạng `app.js`: có Node `timeline` legacy độc lập nhưng **chưa có action F06/E14 riêng**; đợt này lưu quy tắc ẩn để không đưa nút E14 vào giao diện V3 sau này. **Chưa lập trình F06 V3 đầy đủ.**


### Quy tắc toàn ứng dụng — mọi nút đã yêu cầu ẩn phải ẩn ở MỌI Node (2026-11-08)

**Chủ dự án xác nhận:** “ẩn đi, những nút đã yêu cầu ẩn dù ở nút nào thì cũng sẽ ẩn nhé”. Không gắn quy tắc ẩn chỉ với mã Node ban đầu: **cùng tính năng, tên hoặc biểu tượng tương ứng ở Node khác thì cũng ẩn**. Khi hoàn thiện UI V3, bộ toolbar/action chung phải loại các thao tác này khỏi danh sách render trước khi hiển thị, không chỉ làm mờ/disable nút. Nguyên tắc này ưu tiên hơn việc sao chép nguyên ảnh cũ chứa nút đã ẩn.

**Các hành động đã bị ẩn tính đến lúc này:**

- **I04 — Đánh dấu đối tượng** như *nút độc lập* (không ẩn công cụ chọn vùng bên trong I10 đã duyệt).
- **I13 — Phân đoạn lưới; I14 — Phân tách lớp; I15 — Tầm nhìn toàn cảnh 720°**.
- **I16/V15 — Hơn** trên thanh công cụ Node (không xóa các menu chức năng khác được duyệt).
- **V14 — Tách âm thanh/video; Phân tích/tách cảnh từng khung hình** trên thanh công cụ (không xóa chức năng chụp khung hình hiện tại/đầu/cuối của R02/U21 đã duyệt).
- **D01 — Mở bàn làm việc 3D; D05 — Xem không gian 3D** ở **F05** và các Node khác nếu xuất hiện cùng chức năng.
- **E14 — Timeline chuyên dụng** (không xóa trình phát/tua video, timeline chọn đoạn của V13, hoặc dữ liệu timeline legacy đã lưu).
- **E04 — Quảng cáo hàng loạt** trong Smart Edit và mọi Node có cùng chức năng.

**Không được suy rộng:** D06 — Điều khiển camera, D07 — Chọn góc máy **đã được giữ và dùng chung F03/I12**; D08 — Xuất ảnh từ camera vẫn **chưa được yêu cầu ẩn riêng**, cần chốt, không tự xóa. E07 — Chế độ chỉnh sửa đã được chủ dự án yêu cầu **bỏ qua việc hỏi**, không đồng nghĩa với ẩn. Dữ liệu các workflow/video/ảnh cũ giữ nguyên.

**Hiện trạng code khi ghi:** các chức năng D01/D05 thuộc giao diện V3 chưa có action được render trong app.js, node-common-actions.js, app.html; chỉ cập nhật đặc tả và test chống đưa trở lại, không nhận đã hoàn thiện UI V3. Nút giống nhau ở các Node phải dùng chung thành phần và hành vi, bao gồm quy tắc ẩn.


### Quyết định — F05/D06 Điều khiển camera (2026-11-08)

Chủ dự án trả lời **“ẩn”** khi được hỏi về **D06 — Điều khiển camera** thuộc **F05 — Node Đạo diễn (Director's Desk)**. Không hiển thị D06 tại F05 hoặc bất kỳ Node nào có cùng công cụ điều khiển camera không gian 3D này. Tiếp tục áp dụng quy tắc toàn ứng dụng: nút nào được yêu cầu ẩn thì mọi bản sao cùng chức năng đều ẩn. Không xóa dữ liệu/asset/đường nối cũ. Các nút chỉnh góc máy sinh ảnh hoặc sinh video (F03/I12, F04/V05) có mục đích khác nên **không bị suy rộng thành ẩn**.

**Trạng thái:** quyết định ẩn đã chốt; giao diện V3 chưa có nút D06 trên GitHub main, chưa cần sửa một nút runtime không tồn tại. **Cập nhật mới:** F05/D07 — Chọn góc máy **GIỮ**, đồng thời có giao diện và chức năng **GIỐNG F03/I12 — Nhiều góc độ**. Không cần hỏi lại.


### Quyết định — F05/D07 Chọn góc máy (2026-11-08)

Chủ dự án trả lời **“giữ lại”** khi được hỏi về **D07 — Chọn góc máy**, thuộc **F05 — Node Đạo diễn (Director's Desk)**. Phải giữ nút D07 khi dựng UI; không tự áp dụng việc ẩn D01/D05/D06 để xóa D07. **Đã xác nhận ở lượt sau:** D07 giống **F03/I12 — Nhiều góc độ** về giao diện và chức năng, không cần xin ảnh riêng; chưa code.


### Xác nhận F05/D07 dùng chung F03/I12 và tiến độ hỏi nút (2026-11-08)

Người dùng trả lời **“giống F3, các nút có biểu tượng giống nhau thì nó giống nhau”**. D07 là nút **Chọn góc máy** của F05, phải dùng nguyên giao diện/trình xử lý **F03/I12 — Nhiều góc độ** đã được người dùng chốt, không hỏi lại hoặc tạo phiên bản khác. Mọi nút có biểu tượng và ý nghĩa tương đương qua các Node dùng cùng UX và handler; nút đã ẩn thì ẩn khắp ứng dụng theo quyết định mới nhất.

**Kiểm kê 122 nút:** ở thời điểm này, nhóm **cần tiếp tục hỏi quyết định/chức năng đặc thù** còn 5 mã chính: **F05/D08 — Xuất ảnh từ camera** và **F06/E03, E04, E05, E06** (bốn preset Smart Edit; người dùng từng muốn chỉ giữ hai và ẩn hai, nhưng chưa chỉ rõ chính xác). **F06/E07** được yêu cầu **bỏ qua hỏi hiện tại**, chưa quyết định giữ hay ẩn: nếu tính cả mục tạm hoãn thì tổng cộng **6 đầu mục chưa chốt**. Các nút chia sẻ giống biểu tượng hoặc quy tắc chung không cần hỏi lại từng cái; con số này chỉ là số nút cần *chốt yêu cầu*, **không phải số nút đã lập trình**. D08 cần hỏi tiếp sau khi trả lời con số. Một số chi tiết kỹ thuật còn tùy AI/model kết nối và kiểm thử ứng dụng V3; không coi đặc tả là hoàn thiện sản phẩm.


### 2026-11-08 — D08 đã chốt và E03 tạm hoãn

- **F05/D08 — Xuất ảnh từ camera:** người dùng xác nhận “ok” với đặc tả: trích góc nhìn camera hiện tại trên F05 thành **một ảnh mới**, tương tự chụp khung hình nhưng nguồn camera/scene. Giữ nguyên cảnh nguồn; chưa code.
- **F06/E03 — Video thuyết minh:** người dùng chọn phương án **3 — để làm sau**. Không yêu cầu ảnh hay đặt câu hỏi E03 nữa ở vòng hiện tại. **Không đồng nghĩa với ẩn nút** và chưa chốt chức năng E03.
- **Cập nhật:** F06/E04 — Quảng cáo hàng loạt **ĐÃ YÊU CẦU ẨN**. Hỏi tiếp E05 rồi E06. E07 cũng đang bỏ qua. Nhóm Smart Edit trước đó có ý định giữ hai/ẩn hai trong bốn preset, nhưng E03 hoãn nên cần tránh suy luận số lượng giữ/ẩn khi chưa có quyết định.


### Quyết định — F06/E04 Quảng cáo hàng loạt (2026-11-08)

Chủ dự án trả lời **“ẩn”** cho **E04 — Quảng cáo hàng loạt**, thuộc F06 — Smart Edit. Đánh dấu **⛔ ẨN trên toàn ứng dụng**: không render nút E04 ở F06, cũng không hiện nút/preset trùng chức năng ở bất kỳ Node nào, bất kể Node đang trống hay có kết quả. Không xóa nội dung/video/workflow trước đây. **E03 — Video thuyết minh vẫn để làm sau**, không tự chuyển thành ẩn; **E05/E06** chưa chốt.

**Tình trạng:** quyết định giao diện, **chưa triển khai đầy đủ UI F06 V3**. Nút tiếp theo: **F06/E05 — Video podcast**, hỏi giữ, ẩn hay làm sau.
