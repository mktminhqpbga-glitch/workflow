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
| I10 | Chỉnh sửa phần tử | Công cụ sửa phần tử khi chọn ảnh. | 🔴 |
| I11 | HD | Nâng cấp HD khi model hỗ trợ. | 🔴 |
| I12 | Nhiều góc độ | Tạo các góc nhìn. | 🔴 |
| I13 | Phân đoạn lưới | Cắt/chia ảnh theo lưới. | 🔴 |
| I14 | Phân tách lớp | Tách lớp ảnh. | 🔴 |
| I15 | Toàn cảnh 720° | Công cụ pano 720°. | 🔴 |
| I16 | Hơn | Menu công cụ ngữ cảnh mở khi chọn. | 🟡 |
| I17 | Nhân bản | Duplicate Node hoặc ảnh theo lựa chọn. | 🟡 |
| I18 | Vẽ/đánh dấu | Ghi chú chỉnh sửa ngay trên ảnh. | 🔴 |
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
| V10 | Chuyển động sâu | Công cụ chuyển động/depth. | 🔴 |
| V11 | HD | Nâng chất lượng video. | 🔴 |
| V12 | Xóa phụ đề | Chỉ hoạt động khi có bộ xử lý thật. | 🔴 |
| V13 | Làm lại đoạn video | Chỉnh và tái tạo một phân đoạn. | 🔴 |
| V14 | Tách âm thanh | Trích audio từ video. | 🟡 |
| V15 | Hơn | Menu công cụ bổ sung. | 🟡 |
| V16 | Phát/tạm dừng | Player nội bộ. | 🟡 |
| V17 | Tải video | Lưu output hợp lệ. | 🟡 |
| V18 | Zoom xem video | Xem video lớn. | 🟡 |
| V19 | Nút gửi ↑ | Ready/spinner/lỗi đỏ. | 🟡 |
| V20 | Tạo lại video | Chạy lại có chủ đích, không tự rerun. | 🟡 |
| V21 | Thu gọn Prompt | Ẩn/mở khung nhập theo mẫu. | 🔴 |

## F05 — Bàn làm việc của giám đốc

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| D01 | Mở bàn làm việc | Đi tới trình làm việc đạo diễn. | 🔴 |
| D02 | Nhập mô tả cảnh | Nhập brief scene. | 🟡 |
| D03 | Thêm ảnh tham chiếu | Upload/chọn tham chiếu. | 🟡 |
| D04 | Gửi tạo cảnh ↑ | Gửi Prompt tạo bối cảnh. | 🔴 |
| D05 | Xem không gian 3D | Preview scene 3D thực. | 🔴 |
| D06 | Điều khiển camera | Camera trong cảnh. | 🔴 |
| D07 | Chọn góc máy | Lưu góc máy mong muốn. | 🔴 |
| D08 | Xuất ảnh từ camera | Render/snapshot. | 🔴 |
| D09 | Thu gọn Prompt | Theo chuẩn Node. | 🔴 |

## F06 — Chỉnh sửa thông minh

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| E01 | Nhận video tham chiếu | Kết nối hoặc tải tệp video. | 🟡 |
| E02 | Nhập lệnh chỉnh sửa | Prompt yêu cầu edit. | 🟡 |
| E03 | Video thuyết minh | Preset chỉnh sửa. | 🔴 |
| E04 | Quảng cáo hàng loạt | Preset xử lý nhiều quảng cáo. | 🔴 |
| E05 | Video podcast | Preset edit podcast. | 🔴 |
| E06 | Biên tập tư liệu | Preset cắt clip. | 🔴 |
| E07 | Chế độ chỉnh sửa | Chọn mode phù hợp. | 🔴 |
| E08 | Tỷ lệ khung hình | Thông số xuất. | 🟡 |
| E09 | Thời lượng đầu ra | Thiết lập độ dài. | 🟡 |
| E10 | Nhân bản | Duplicate. | 🟡 |
| E11 | Cắt khung | Crop theo ảnh mẫu. | 🔴 |
| E12 | Tải video | Lưu output. | 🟡 |
| E13 | Zoom xem video | Preview lớn. | 🟡 |
| E14 | Timeline chuyên dụng | Mở editor timeline thật. | 🟡 |
| E15 | Nút gửi ↑ | Gửi lệnh edit. | 🔴 |
| E16 | Thu gọn Prompt | Theo mẫu Node. | 🔴 |

## F07 — Sinh âm thanh AI

| Mã | Nút/điều khiển | Mẫu & hành vi theo yêu cầu | Trên GitHub main |
|---|---|---|---|
| A01 | Nhập Prompt | Mô tả âm thanh. | 🟡 |
| A02 | Tải âm thanh tham chiếu | Tệp/audio mẫu. | 🟡 |
| A03 | Tham chiếu Canvas | Nhận audio/video/text có kiểu. | 🟡 |
| A04 | Âm thanh → Video | Nối tín hiệu phù hợp. | 🔴 |
| A05 | Chọn AI/model/tab | Provider, model và nơi gửi. | 🟡 |
| A06 | WAV/MP3 | Chọn định dạng đầu ra. | 🟡 |
| A07 | Thời lượng | Độ dài âm thanh. | 🟡 |
| A08 | Giọng nói | Chọn giọng khi có TTS. | 🟡 |
| A09 | Dịch Việt ↔ Anh | Giống T07/S07: **chỉ dịch nội dung Prompt** Việt ↔ Anh, không dịch giao diện. | 🔴 |
| A10 | Cài đặt nâng cao | Locale/tần số sample/codec theo model. | 🔴 |
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
| U10 | Công cụ ảnh AI | Chỉ mở toolbar khi chọn Node. | 🔴 |

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
| U21 | Công cụ video AI | Toolbar chỉ hiện khi chọn. | 🔴 |

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
- Các công cụ riêng còn chờ giải thích: F02 S01/S03; F03 I05/I10–I15/I18 (I04 đã được yêu cầu ẩn); F04 V05/V10–V14; F05 D01/D05–D08; F06 E03–E07/E11/E14; F07 A04/A10; R01 U10; R02 U21. **Các hình minh họa trợ giúp là đề xuất ý nghĩa thao tác, không phải chức năng đã được xác nhận hoặc đã triển khai.** Chủ dự án sẽ xem từng hình rồi chốt lại.


### Quyết định giao diện — I04 (2026-11-08)

Chủ dự án yêu cầu **ẩn nút I04 — Đánh dấu đối tượng** khỏi **F03 — Sinh ảnh AI**. Không hiển thị I04 trong toolbar hay menu F03, không thêm chức năng giả cho nút này, không xóa dữ liệu Node/ảnh đã lưu. Mã `app.js`, `app.html` và `node-common-actions.js` ở trạng thái hiện tại chưa có nút I04 được render; vì thế thay đổi này là **quyết định UI đã chốt và tránh tái thêm trong V3**, không phải bằng chứng đã hoàn thành toàn bộ F03.
