# MuseFlow V3 — TẤT CẢ 122 NÚT: CHỨC NĂNG VÀ BẢNG KIỂM CHO AI KHÁC

> **BẢN ĐẶC TẢ ĐỘC LẬP — ngày 08/11/2026.** Dùng nguyên trang này để AI khác kiểm tra hoặc lập trình. Đây là **yêu cầu chức năng đã thống nhất**, **KHÔNG phải báo cáo rằng 122 nút đã chạy**. Nguồn quyết định: người dùng cung cấp ảnh và xác nhận trong hội thoại, đối chiếu `docs/NODE_BUTTON_INVENTORY.md` (chi tiết + lịch sử).

**Repository:** [mktminhqpbga-glitch/workflow](https://github.com/mktminhqpbga-glitch/workflow) · Nhánh `main` · Tệp chính `app.js`, `app.html` · AI `ai-providers.js`, `ai-action-presets.js`, `node-common-actions.js`.

**Đối tượng kiểm tra:** 9 nhóm Node (F01–F07, R01–R02), **122 mã nút/điều khiển**. Có thêm các thao tác dùng chung và Canvas cần kiểm tra bên dưới.

## 1. Những quy tắc bắt buộc áp dụng cho TẤT CẢ Node

1. **Cùng biểu tượng/cùng chức năng = cùng UI, cùng handler, cùng kết quả.** Không viết hai luồng hành động trùng tên ở Node khác nhau. Ví dụ R01/U10 dùng F03; R02/U21 dùng F04; F05/D07 dùng F03/I12; F07/A04 và A10 dùng cùng một màn hình.
2. **Mọi nút đã yêu cầu ẩn phải ẩn ở tất cả Node có chức năng giống nhau** — không chỉ disabled, không tự đưa lại khi theo ảnh cũ. Đặc biệt **toàn bộ F06 Smart Edit phải ẩn ở danh sách thêm Node và các menu tạo mới**. Giữ dữ liệu dự án cũ, không xóa media/Node cũ.
3. **Toolbar nổi chỉ xuất hiện nếu Node đã có dữ liệu ảnh/video/âm thanh kết quả thực (hoặc tệp đã tải lên) VÀ đang được chọn**. Canvas trống/bỏ chọn phải ẩn ngay; hover không làm toolbar hiện.
4. **Nút nào cần AI phải thực thi chức năng thật**: có nguồn hợp lệ → kiểm tra AI/model/tab đã kết nối và có khả năng tương thích → ghép *prompt chỉ dẫn ẩn theo tác vụ* cùng Prompt người dùng + tham chiếu → gửi AI một lần theo nút gửi/chạy → nhận media đúng kiểu → tạo Node/kết quả mới, giữ nguồn → trạng thái đang chạy/lỗi/hoàn tất. **Không mô phỏng, không trả giả, không âm thầm bỏ qua video/ảnh tham chiếu**.
5. **Prompt ẩn không phải Prompt người dùng**: không ghi đè ô chữ người dùng; có thể kiểm tra nội bộ qua mã nguồn và log chẩn đoán an toàn (không lộ khóa/token). Ví dụ nút Chuyển động sâu phải có chỉ dẫn nhận chủ thể, chiều sâu/parallax và chuyển động từ video gốc.
6. **Trước khi gửi AI**: từ chối nếu nhà cung cấp không hỗ trợ loại tác vụ/nguồn video, API key/tab không hợp lệ, thời lượng/tỷ lệ ngoài khả năng. Trả lỗi giải thích thay vì chuyển thành tác vụ khác. Không mặc định rằng mọi model có thể xử lý video đầu vào.
7. **Một kho tài sản chung**, phân loại ảnh/video/audio/nhân vật/bối cảnh/sản phẩm/hiệu ứng/mẫu. Hỗ trợ tải tệp, Canvas và kho; cổng kết nối đúng kiểu; không làm rơi dữ liệu khi zoom/đổi lựa chọn.
8. **Các thao tác media không cần AI** (tua, phát, tải xuống, chụp ảnh frame) phải xử lý cục bộ trực tiếp, không gửi prompt ẩn hoặc tốn lượt AI.

## 2. Các hành động phải ẩn vĩnh viễn (trừ khi chủ dự án đổi quyết định)

| Mã | Hành động đã ẩn | Phạm vi |
|---|---|---|
| I04 | Đánh dấu đối tượng là nút độc lập | Tất cả Node; **không xóa các công cụ chọn vùng bên trong I10** |
| I13 | Phân đoạn lưới | Tất cả Node |
| I14 | Phân tách lớp | Tất cả Node |
| I15 | Toàn cảnh 720° | Tất cả Node |
| I16, V15 | Hơn / More trên thanh công cụ | Tất cả Node |
| V14 | Tách âm thanh/video | Tất cả Node |
| Không có mã riêng | Phân tích/tách cảnh từng khung hình trên toolbar video | Tất cả Node; **khác** với chụp 1 frame của U21 |
| D01 | Mở bàn 3D | Tất cả Node |
| D05 | Xem không gian 3D | Tất cả Node |
| D06 | Điều khiển camera 3D | Tất cả Node; D07 vẫn giữ |
| E04 | Quảng cáo hàng loạt | Tất cả Node |
| E14 | Timeline chuyên dụng | Tất cả Node; **khác** với thanh tua video và timeline chọn đoạn V13 |
| F06 (cả Node) | Smart Edit — Chỉnh sửa thông minh (E01–E16) | **Ẩn cả Node khỏi mọi lối tạo mới**; không xóa workflow lưu trước |

## 3. Danh sách đầy đủ 122 mã — một mã = một chức năng phải kiểm tra

**Cách đọc:** Cột “Phải làm khi sử dụng” là yêu cầu UX, không phải kết quả kiểm thử. **ẨN** nghĩa là không cho người dùng thấy; các nút trùng chức năng phải dùng chung code. Nút F06 được ghi lại chỉ để kiểm kê, **không được hiển thị**.

### F01 — Văn bản (10)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **T01** | Ô nhập nội dung | Soạn và sửa nội dung trực tiếp trên thẻ; lưu nội dung, xuất cổng text sang Node nối tiếp. |
| **T02** | Tự viết nội dung | Soạn văn bản thủ công. Khi chọn thẻ có thanh định dạng (màu chữ, font, đậm/nghiêng/gạch, mở rộng); không gửi AI nếu không bấm gửi. |
| **T03** | Văn bản → Video | Dùng văn bản làm đầu vào Node Video; dây nối phải truyền chính xác văn bản đang có. |
| **T04** | Ảnh → suy ngược Prompt | Nhận ảnh rồi dùng AI phân tích thành Prompt. **Mỗi ảnh nguồn cho một Prompt riêng**, liên kết ngược tới ảnh nguồn, không gộp chung. |
| **T05** | Văn bản → Nhạc | Đưa mô tả chữ sang Node sinh nhạc/âm thanh được kết nối; không tự tạo audio giả. |
| **T06** | Chọn AI, model và tab | Chọn **AI → model → đúng tab/phiên đã kết nối**, chỉ hiện lựa chọn đang khả dụng. |
| **T07** | Dịch hai chiều | Dịch riêng nội dung ô Prompt Việt ↔ Anh; không dịch toàn bộ giao diện; giữ bản gốc để hoàn tác. |
| **T08** | Gửi Prompt ↑ | Mũi tên ↑ thực sự gửi yêu cầu, hiển thị ready/đang chạy/lỗi; khóa gửi trùng; nhận kết quả text. |
| **T09** | Thu gọn / mở rộng Prompt | Hai mũi tên chéo mở trình nhập Prompt lớn trên Canvas; thu gọn về dưới Node, không mất chữ/tham chiếu/model. |
| **T10** | Cổng nhận/gửi | Cổng + và dây nối truyền dữ liệu đúng kiểu (text, image, video, audio) giữa các Node. |

### F02 — Kịch bản (10)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **S01** | Kịch bản → tạo phân cảnh/tài sản | Từ kịch bản tạo tài sản theo menu (ảnh nhân vật, đồ thị cảnh, ảnh sản phẩm, sáng tạo toàn năng); lưu kết quả và nối tới Node tương ứng. Với nhân vật, một ảnh tham chiếu có thể tạo sheet 3 góc trước/sau/nghiêng theo mẫu. |
| **S02** | Nhân vật/ảnh → tạo kịch bản | Dùng nhiều ảnh nhân vật/nguồn Canvas làm tham chiếu kịch bản; thứ tự thumbnail và dây nối được giữ; gửi AI mới sinh kết quả. |
| **S03** | Tự viết kịch bản phân cảnh | Mở bảng phân cảnh có các trường số cảnh, thời lượng, hình, góc máy, ánh sáng, thoại, âm thanh, chuyển động; người dùng được sửa trước khi xuất/gửi AI. |
| **S04** | Nhập nội dung kịch bản | Nhập/chỉnh sửa kịch bản ngay trong Node hoặc nhận văn bản từ F01. |
| **S05** | Thêm ảnh tham chiếu | Thêm nhiều tham chiếu từ tệp, Canvas hoặc **một kho tài sản chung**; xem thumbnail và loại dữ liệu. |
| **S06** | Chọn AI/model/tab | Chọn AI, model và tab thực đang kết nối; dùng logic chọn AI chung. |
| **S07** | Dịch Việt ↔ Anh | Chỉ dịch ô Prompt Việt ↔ Anh như T07. |
| **S08** | Gửi Prompt ↑ | Gửi Prompt/đầu vào tới AI, có ready/spinner/đỏ; không tự gửi khi ảnh nguồn đổi. |
| **S09** | Thu gọn / mở rộng Prompt | Mở lớn/thu gọn Prompt như T09, giữ ảnh và nội dung. |
| **S10** | Hiển thị và gửi kết quả kịch bản | Xem, sửa, lưu và xuất kịch bản/shot list; truyền ra Node sau nếu có nội dung hợp lệ. |

### F03 — Sinh ảnh AI (22)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **I01** | Nhập Prompt | Nhập Prompt mô tả ảnh, có thể bổ sung ảnh nguồn và cấu hình riêng. |
| **I02** | Tải ảnh tham chiếu | Tải ảnh tham chiếu từ máy; hiển thị thumbnail và giữ tệp liên kết. |
| **I03** | Tham chiếu từ Canvas | Chọn ảnh nguồn từ các Node hiện trên Canvas; dây nối đúng cổng image. |
| **I04** | Đánh dấu đối tượng | **ẨN TOÀN ỨNG DỤNG** nút Đánh dấu đối tượng độc lập; không nhầm với công cụ chọn vùng trong I10. |
| **I05** | Chọn phong cách | Mở hộp thoại preset phong cách lớn nền tối, tìm kiếm, tab danh mục, lưới thẻ style; chọn một style để gắn vào yêu cầu sinh ảnh. |
| **I06** | Chọn AI/model/tab | Chọn AI tạo ảnh/model/tab đã kết nối. |
| **I07** | Tỷ lệ khung hình | Chọn tỷ lệ hình hợp lệ theo model (ví dụ 1:1/16:9/9:16). |
| **I08** | Độ phân giải 1K/2K/4K | Chọn chất lượng/độ phân giải 1K/2K/4K nếu model hỗ trợ; không giả kết quả độ phân giải. |
| **I09** | Số lượng ảnh | Chọn số lượng ảnh sinh ra; đúng số lượng được dịch vụ hỗ trợ, nhận và lưu các đầu ra. |
| **I10** | Chỉnh sửa phần tử | Chỉ hiện khi **ảnh đã có và Node đang chọn**. Chế độ chỉnh phần tử: phủ lớp tối, nút ×, chọn điểm, chọn khung nét đứt, brush, undo; thao tác chọn không tự gọi AI. |
| **I11** | HD / Nâng cấp độ phân giải | Khi chọn ảnh kết quả → HD tạo **Node HD mới nối ảnh nguồn**, chọn AI/model và mức 2×/4×/6×, gửi prompt tác vụ nâng cấp ẩn tới AI hỗ trợ image-to-image; ảnh mới, không ghi đè. |
| **I12** | Nhiều góc độ | Mở trình chọn nhiều góc camera: preset, quả cầu quỹ đạo, xoay ngang/dọc, zoom, reset; gửi prompt AI ẩn để **tạo ảnh MỚI của cùng nhân vật ở góc khác**, không chỉ xoay pixel. |
| **I13** | Phân đoạn lưới | **ẨN** nút Phân đoạn lưới ở mọi Node. |
| **I14** | Phân tách lớp | **ẨN** nút Phân tách lớp ở mọi Node. |
| **I15** | Tầm nhìn toàn cảnh 720 độ | **ẨN** nút Toàn cảnh 720° ở mọi Node. |
| **I16** | Hơn | **ẨN** menu Hơn/More ở mọi Node. |
| **I17** | Nhân bản | Nhân bản Node/ảnh, tạo ID mới và giữ dữ liệu/dây nối hợp lệ. |
| **I18** | Vẽ/đánh dấu | Chỉ khi đã có ảnh: vẽ nét, khoanh vùng, gõ chữ, chọn màu, độ dày, undo/redo; bấm Lưu mở **ghi chú nhỏ màu vàng** có text. Không tự gọi AI. |
| **I19** | Tải ảnh | Tải đúng tệp ảnh đầu ra gốc, không xuất placeholder. |
| **I20** | Zoom xem ảnh | Phóng to/xem ảnh trên lớp phủ, thu về mà không đổi Node. |
| **I21** | Nút gửi ↑ | Gửi Prompt ảnh tới AI, spinner, lỗi đỏ, lưu ảnh trả về. |
| **I22** | Thu gọn/mở rộng Prompt | Mở rộng/thu gọn ô Prompt, neo dưới Node theo Canvas zoom. |

### F04 — Sinh video AI (21)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **V01** | Nhập Prompt | Nhập lệnh mô tả video đầu ra. |
| **V02** | Tải ảnh/video tham chiếu | Đính kèm ảnh/video tham chiếu từ máy vào đúng cổng được hỗ trợ. |
| **V03** | Tham chiếu Canvas | Chọn ảnh/video từ Canvas làm nguồn cho Node Video. |
| **V04** | Thư viện nhân vật | Mở thư viện nhân vật chung để đưa nhân vật tham chiếu vào Prompt/video. |
| **V05** | Công cụ góc máy | Mở bảng thông số góc máy, loại máy, ống kính, tiêu cự, khẩu độ và công tắc theo ảnh mẫu; đưa thông số vào hướng dẫn AI phù hợp. |
| **V06** | Chọn AI/model/tab | Chọn AI hỗ trợ video, model và tab đã kết nối, không hiển thị model không hỗ trợ. |
| **V07** | Tỷ lệ khung hình | Chọn tỷ lệ video 16:9/9:16/1:1... theo năng lực model. |
| **V08** | Thời lượng | Chọn thời lượng clip hợp lệ với AI đã chọn. |
| **V09** | Chất lượng video | Chọn độ phân giải/chất lượng có hỗ trợ; cảnh báo rõ giới hạn từng model. |
| **V10** | Ghi hình chuyển động chiều sâu | **Chuyển động chiều sâu:** Khi có video kết quả và Node chọn, tạo Node xử lý **nối video nguồn**; cấu hình xem trước 480P/720P; tự kèm **prompt ẩn về parallax, chủ thể, chuyển động chiều sâu và giữ nguồn**, gửi AI có khả năng video-to-video/motion reference; trả video **MỚI**, giữ bản gốc. Không mô phỏng bằng CSS. |
| **V11** | HD / Nâng chất lượng video | **Video HD:** Tạo Node HD nối video nguồn, chọn 1080P/2K/4K, bù khung/giảm tốc 1×; prompt ẩn yêu cầu enhance video thật. Chỉ gửi adapter nhận video nguồn; có video đầu ra mới. |
| **V12** | Xóa phụ đề | **Xóa phụ đề:** Gửi video nguồn và prompt ẩn yêu cầu xóa **chữ phụ đề cháy vào khung hình**, inpaint nền xuyên suốt frame; trả video mới, giữ bản gốc; không chỉ ẩn phụ đề trong trình phát. |
| **V13** | Làm lại đoạn video | **Làm lại đoạn video:** Mở Node kết nối video gốc, player và timeline thumbnail; chọn chính xác đoạn, thêm Prompt/tham chiếu, prompt ẩn yêu cầu **thay riêng đoạn đã chọn** và giữ nguyên phần còn lại; chờ AI trả video mới. |
| **V14** | Tách âm thanh / Tách âm thanh và video | **ẨN toàn ứng dụng** Tách âm thanh/video khỏi thanh công cụ; chức năng phân tích từng khung hình cũng ẩn. |
| **V15** | Hơn | **ẨN** Hơn/More trên mọi thanh công cụ Node. |
| **V16** | Phát/tạm dừng | Phát/tạm dừng video thực trong Node. |
| **V17** | Tải video | Tải video kết quả thực khi đã có, không tải placeholder. |
| **V18** | Zoom xem video | Phóng to video player, giữ điều khiển phát/tua/âm lượng. |
| **V19** | Nút gửi ↑ | Gửi yêu cầu tạo video thực tới AI đã chọn; spinner và trạng thái lỗi rõ ràng. |
| **V20** | Tạo lại video | Chạy lại video có chủ ý; không tự gọi lặp vô hạn. |
| **V21** | Thu gọn Prompt | Mở/thu nhỏ vùng Prompt video theo bố cục chung. |

### F05 — Đạo diễn (9)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **D01** | Mở bàn làm việc 3D | **ẨN toàn ứng dụng** nút Mở bàn làm việc 3D. |
| **D02** | Nhập mô tả cảnh | Nhập mô tả cảnh cho F05 nếu Node có giao diện; **F05 còn được giữ**, riêng nút 3D bị ẩn. |
| **D03** | Thêm ảnh tham chiếu | Thêm ảnh tham chiếu cảnh từ máy/Canvas/kho chung. |
| **D04** | Gửi tạo cảnh ↑ | Gửi Prompt tạo cảnh AI; phải có bộ xử lý thật, không sinh kết quả giả. |
| **D05** | Xem không gian 3D | **ẨN toàn ứng dụng** nút Xem không gian 3D. |
| **D06** | Điều khiển camera | **ẨN toàn ứng dụng** nút Điều khiển camera trong không gian 3D. |
| **D07** | Chọn góc máy | **GIỮ**, giao diện và logic **giống F03/I12 — Nhiều góc độ**; cùng biểu tượng = cùng hành vi, sinh ảnh góc mới khi có nguồn. |
| **D08** | Xuất ảnh từ camera | Xuất **một ảnh mới** từ góc camera hiện tại của cảnh, giữ cảnh gốc; tương tự chụp frame nhưng nguồn là góc nhìn camera. |
| **D09** | Thu gọn Prompt | Thu gọn/mở rộng Prompt như các Node khác. |

### F06 — Chỉnh sửa thông minh (ẨN CẢ NODE) (16)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **E01** | Nhận video tham chiếu | **ẨN CÙNG NODE F06**. Đã từng dùng để nhận video tham chiếu. |
| **E02** | Nhập lệnh chỉnh sửa | **ẨN CÙNG NODE F06**. Đã từng nhập Prompt edit. |
| **E03** | Video thuyết minh | **ẨN CÙNG NODE F06**; trước đó tạm hoãn chốt preset Video thuyết minh, không triển khai. |
| **E04** | Quảng cáo hàng loạt | **ẨN** Quảng cáo hàng loạt toàn ứng dụng, kể cả ngoài F06. |
| **E05** | Video podcast | **ẨN CÙNG NODE F06**; không cần hỏi Video podcast nữa. |
| **E06** | Biên tập tư liệu | **ẨN CÙNG NODE F06**; không cần hỏi Biên tập tư liệu nữa. |
| **E07** | Chế độ chỉnh sửa | **ẨN CÙNG NODE F06**; trước đó bỏ qua hỏi chi tiết. |
| **E08** | Tỷ lệ khung hình | **ẨN CÙNG NODE F06**; từng là tùy chọn tỷ lệ video. |
| **E09** | Thời lượng đầu ra | **ẨN CÙNG NODE F06**; từng là độ dài video. |
| **E10** | Nhân bản | **ẨN CÙNG NODE F06**; nhân bản ở các Node khác vẫn được giữ. |
| **E11** | Cắt khung / Lấy ảnh khung hình | **ẨN CÙNG NODE F06**; từng chốt lấy khung hình đang chọn → tạo ảnh riêng. Tác vụ trích khung ở R02/U21 vẫn giữ. |
| **E12** | Tải video | **ẨN CÙNG NODE F06**; tải video ở các Node khác vẫn giữ. |
| **E13** | Zoom xem video | **ẨN CÙNG NODE F06**; xem lớn video ở các Node khác vẫn giữ. |
| **E14** | Timeline chuyên dụng | **ẨN** Timeline chuyên dụng toàn ứng dụng, không ẩn thanh tua và timeline chọn đoạn V13. |
| **E15** | Nút gửi ↑ | **ẨN CÙNG NODE F06**; gửi AI ở các Node khác vẫn giữ. |
| **E16** | Thu gọn Prompt | **ẨN CÙNG NODE F06**; thu gọn Prompt ở các Node khác vẫn giữ. |

### F07 — Sinh âm thanh AI (13)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **A01** | Nhập Prompt | Nhập Prompt âm thanh/speech/music tùy model thực sự có hỗ trợ. |
| **A02** | Tải âm thanh tham chiếu | Tải audio tham chiếu từ máy, xác minh loại dữ liệu. |
| **A03** | Tham chiếu Canvas | Lấy audio/video/text từ Canvas theo cổng nhận của tác vụ. |
| **A04** | Âm thanh → Video | **Âm thanh → Video:** Mở cùng giao diện **Preset Âm thanh thành Video** như A10, audio waveform + ảnh tham chiếu + khung video + composer và cấu hình; gửi AI hỗ trợ audio/video thực. |
| **A05** | Chọn AI/model/tab | Chọn AI/model/tab phù hợp tác vụ âm thanh, chỉ các dịch vụ đã kết nối. |
| **A06** | WAV/MP3 | Chọn WAV/MP3 nếu backend hỗ trợ, không chỉ đổi tên phần mở rộng. |
| **A07** | Thời lượng | Chọn thời lượng audio hợp lệ theo model. |
| **A08** | Giọng nói | Chọn giọng nói khi sử dụng AI TTS được hỗ trợ. |
| **A09** | Dịch Việt ↔ Anh | Chỉ dịch nội dung chữ Prompt Việt ↔ Anh, không thay đổi giao diện. |
| **A10** | Cài đặt nâng cao | **Mở cùng preset Âm thanh → Video như A04** theo xác nhận người dùng; không làm 2 UI hoặc 2 logic. Ảnh mẫu không chứng minh có popup tham số riêng. |
| **A11** | Nút gửi ↑ | Gửi yêu cầu âm thanh tới AI kết nối, trạng thái spinner/lỗi đúng. |
| **A12** | Nghe kết quả | Phát kết quả audio thực, waveform và điều khiển player. |
| **A13** | Thu gọn Prompt | Thu gọn/mở rộng vùng nhập Prompt audio theo chuẩn chung. |

### R01 — Ảnh tải lên (10)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **U01** | Chọn ảnh từ máy | Chọn ảnh cục bộ từ máy vào R01, hiển thị ảnh thật. |
| **U02** | Dán ảnh clipboard | Dán ảnh clipboard vào R01, không tạo file giả. |
| **U03** | Hiển thị preview ảnh | Xem preview ảnh tải lên đúng tỷ lệ và dữ liệu gốc. |
| **U04** | Đổi tên | Đổi tên Node R01, giữ trong tệp dự án. |
| **U05** | Nhân bản | Nhân bản Node R01, giữ ảnh nguồn và cổng kết nối đúng. |
| **U06** | Tải ảnh | Tải ảnh R01, giữ dữ liệu ảnh đầu vào. |
| **U07** | Phóng to | Phóng to ảnh tải lên bằng lightbox. |
| **U08** | Kết nối sang Node khác | Xuất cổng image sang Node khác, kiểm tra đúng kiểu. |
| **U09** | Thay ảnh | Thay ảnh tải lên, cập nhật preview và các Node phụ thuộc mà không làm hỏng dây. |
| **U10** | Công cụ ảnh AI (ảnh tải lên) | **Thanh công cụ ảnh tải lên R01**: GIỐNG hoàn toàn toolbar F03 khi ảnh đã sẵn sàng và được chọn; nút cùng biểu tượng dùng cùng code. Các nút đã ẩn cũng ẩn. |

### R02 — Video tải lên (11)

| Mã | Nút / điều khiển | Phải làm khi sử dụng |
|---|---|---|
| **U11** | Chọn video từ máy | Chọn video cục bộ vào Node R02. |
| **U12** | Hiển thị video | Preview player video thật của Node R02. |
| **U13** | Phát/tạm dừng | Phát/tạm dừng video upload. |
| **U14** | Thanh tua | Thanh tua video/scrub tới thời điểm muốn xem. |
| **U15** | Âm lượng | Tắt/bật âm lượng và điều chỉnh audio. |
| **U16** | Đổi tên | Đổi tên Node video tải lên, lưu dự án. |
| **U17** | Nhân bản | Nhân bản Node video tải lên cùng dữ liệu. |
| **U18** | Tải video | Tải lại video gốc theo media thật. |
| **U19** | Phóng to video | Phóng to player video upload. |
| **U20** | Kết nối sang Node khác | Xuất cổng video sang Node khác, đúng kiểu và dây nối. |
| **U21** | Công cụ video AI (video tải lên) | **Thanh công cụ video tải lên R02**: GIỐNG F04 với Chuyển động sâu, HD, Xóa phụ đề, Làm lại đoạn. Nút camera ▼ có **3 cách trích ảnh ngay không AI**: frame hiện tại / frame đầu / frame cuối; ảnh mới giữ tỷ lệ, độ phân giải khung gốc. Ẩn Tách audio/video, Phân tích từng frame, Hơn. |

## 4. BỘ HÀNH ĐỘNG DÙNG CHUNG (không được copy code nhiều lần)

| Mã chung | Hành vi |
|---|---|
| C01 | Chọn AI → model → tab/phiên đang kết nối, lọc theo đúng khả năng text/image/video/audio |
| C02 | Dịch Việt ↔ Anh chỉ trên văn bản Prompt hiện tại, giữ bản gốc |
| C03 | Gửi ↑ thực sự chạy, trạng thái sẵn sàng → spinner → thành công/lỗi, chặn bấm lặp |
| C04 | Prompt thường nằm dưới Node, mở lớn nổi trên Canvas, đóng về vị trí cũ không mất nội dung |
| C05 | Thêm tham chiếu từ Canvas / máy / **kho tài sản chung** |
| C06 | Tải xuống đúng tệp media hoặc văn bản kết quả; không hiện nếu chưa có |
| C07 | Phóng to/xem media thật với audio/video player khi phù hợp |
| C08 | Nhân bản Node đúng dữ liệu và dây nối hợp lệ; tạo ID mới |

**Canvas:** chọn/bỏ chọn, kéo Node, kéo dây nối hợp kiểu, đổi tên, xóa có an toàn/undo, zoom Canvas, Prompt vẫn neo màn hình khi zoom, chạy/lỗi không mất dữ liệu. Nút bấm **không được nháy rồi trở về trạng thái cũ mà không thực hiện chức năng**.

## 5. ĐẶC TẢ PROMPT ẨN CHO TÁC VỤ AI

**Cơ chế chuẩn:** `task_id + source_media + user_prompt + settings + connected_provider/model/tab` → kiểm tra capability → tạo **internal task instruction** (không thay `user_prompt`) → gửi AI → xác minh kết quả về đúng kiểu `image/video/text/audio` → lưu kết quả mới. Có kiểm tra hủy/chạy trùng, lỗi mạng và provider.

| Nút | Nguồn bắt buộc | Nội dung **prompt ẩn** mà AI phải hiểu | Kết quả |
|---|---|---|---|
| I11 — HD ảnh | Ảnh gốc | Nâng chi tiết lên 2×/4×/6× nếu model hỗ trợ, giữ nhân vật, nét mặt, tư thế, bố cục, màu và nền; không chỉ CSS resize | Ảnh **mới** và kích thước thực |
| I12 / D07 — Nhiều góc độ | Ảnh nhân vật/cảnh nguồn | Dựng góc camera khác theo preset, xoay ngang/dọc, zoom; giữ đúng chủ thể và cảnh | Ảnh **mới** từ góc khác |
| V10 — Video chuyển động sâu | Video gốc + ảnh tham chiếu theo năng lực AI | “Recreate the subject with coherent depth/parallax and natural motion from original video. Preserve identity, timing, framing and sound. Preview target 480P/720P.” | Video **mới** với chuyển động chiều sâu |
| V11 — HD video | Video gốc | Nâng chi tiết video thật, chọn 1080P/2K/4K, xử lý frame/giữ audio và cảnh; không thay bằng video tự sáng tác | Video enhanced **mới** |
| V12 — Xóa phụ đề | Video có chữ cháy trên khung | Inpaint **chỉ vùng phụ đề**, khôi phục nền xuyên frame, giữ cảnh/tiếng/nhân vật | Video **mới** không phụ đề |
| V13 — Làm lại đoạn | Video gốc + mốc bắt đầu/kết thúc + lệnh người dùng | Chỉ làm lại phân đoạn được chọn, bảo toàn frame/audio ở phần trước/sau, duy trì nối cảnh | Video **mới** có đoạn thay thế |
| S01–S03 — Kịch bản/cảnh | Kịch bản + ảnh nhân vật | Tạo kịch bản/shot list/tài sản theo yêu cầu riêng từng nút; không gộp ảnh nguồn trái yêu cầu | Text/storyboard/ảnh đúng bước |
| T04 — Ảnh → Prompt | Từng ảnh | Phân tích bố cục, nhân vật, phong cách, ánh sáng thành prompt; **mỗi ảnh một kết quả** | Text Prompt cho từng ảnh |
| V05 — Góc máy video | Prompt và thông số camera | Gắn cách quay, ống kính, tiêu cự, khẩu độ đã chọn vào chỉ dẫn AI | Video khi được gửi |
| A04/A10 — Âm thanh → Video | Audio và ảnh tham chiếu theo cấu hình | Tạo video dựa trên nhịp/âm thanh và hình ảnh, có đối chiếu thời lượng và khả năng model | Video **mới** |

**Cập nhật triển khai 2026-11-08 (ưu tiên thông tin mới):** `ai-action-presets.js` hiện định nghĩa tám tác vụ: T04/I11/I12/V10/V11/V12/V13/A04-A10. `app.js` đã nối các nút AI chuyên biệt lên thanh công cụ có kết quả và chỉ gửi tới model được kết nối có khả năng xử lý nguồn. `ai-providers.js` đã có adapter fal Motion Control, Bytedance Video Upscaler, Kling O1 video edit và LTX audio→video. **V11 dùng tham số có cấu trúc của upscaler** (`target_resolution`, `target_fps`, ...), vì endpoint không có ô `prompt`; không được tuyên bố đã gửi prompt văn bản cho V11. Các adapter này **chưa được xác minh bằng tài khoản/API key thật**, và tùy chọn/cấu hình model có thể thay đổi; OpenAI image vẫn chưa hỗ trợ ảnh tham chiếu trong adapter hiện có, Veo chưa nhận video nguồn để chỉnh sửa. Không đánh dấu toàn bộ 122 nút là PASS khi chưa chạy thử chức năng thực tế.

## 6. Checklist để AI khác kiểm tra trên mã nguồn

- [ ] Liệt kê đầy đủ **122 mã**, so với bảng trên, và phát hiện nút thiếu, nút thừa, tên sai.
- [ ] Kiểm tra **toàn bộ F06 ẩn**, các action bị ẩn theo bảng; đảm bảo không xóa các dự án đã lưu.
- [ ] Nhấn từng nút còn hiện trên app thật; **mỗi click phải có hiệu ứng/chức năng hoặc thông báo lỗi có ích**, không chớp nháy rồi reset.
- [ ] So sánh nút cùng biểu tượng ở các Node: component, handler, menu, kết quả phải giống.
- [ ] Với ảnh/video đầu vào đã có: toolbar chỉ hiện khi Node chọn; bỏ chọn phải ẩn.
- [ ] Với I11/I12/V10/V11/V12/V13: xác minh **prompt ẩn được truyền thực sự vào đúng request**, không chỉ tồn tại trong file; kèm nguồn ảnh/video thật.
- [ ] Với V10/V11/V12/V13: xác minh adapter nhận video nguồn; không coi “tạo video từ text” là xử lý video gốc.
- [ ] Với tải ảnh từ video U21: chọn hiện tại/đầu/cuối → có ảnh output thật đúng frame, tỷ lệ, độ phân giải; không gọi AI.
- [ ] Đối chiếu AI/model/tab đã kết nối, không cho phép model sai loại; API lỗi/dừng/yêu cầu bị từ chối phải hiển thị trạng thái đúng.
- [ ] Test lưu/khôi phục dự án, tên Node, media và dây nối; không mất dữ liệu khi chạy lỗi hoặc khi cài lại app.
- [ ] Chạy unit test, smoke test giao diện, thử có/không có kết nối AI; thử video dọc/ngang, ảnh có/không có kết quả.
- [ ] Báo kết quả **theo từng mã**: PASS (đã chạy thật) / PARTIAL / FAIL / HIDDEN đúng / NOT IMPLEMENTED; dẫn file và dòng code, commit, ảnh/test nếu có.

## 7. Trạng thái kiểm chứng khi xuất trang này

- **122 mã đã được mô tả để kiểm tra**, không phải 122 nút đã lập trình.
- `main` hiện là nền tảng legacy MuseFlow 0.31.0, có các Node/adapter dùng chung; phần V3 hoàn chỉnh vẫn cần lập trình và thử thực tế.
- Đã thêm các luồng tác vụ AI chuyên biệt có prompt ẩn và bảo toàn nguồn, chụp 3 vị trí video không cần AI, và công cụ I18 **vẽ/đánh dấu ảnh + ghi chú vàng** sử dụng chung cho ảnh sinh AI/ảnh tải lên (`image-annotation.js/.css`). Nút I10 sửa phần tử và nhiều chi tiết V3 vẫn phải kiểm tra riêng; không gộp với I18.
- **Bằng chứng CI trước khi thêm các test mới:** GitHub Actions [#42444286398](https://github.com/mktminhqpbga-glitch/workflow/actions/runs/42444286398): macOS Intel **124/124** unit pass, build DMG + ZIP, Chromium + Electron + FFmpeg smoke **PASS**. Bản commit sau đã chạy [#42444727888](https://github.com/mktminhqpbga-glitch/workflow/actions/runs/42444727888) với **127/127 unit pass**, macOS Intel DMG/ZIP đã tạo; lúc viết tài liệu, CI cho test giao diện/adapter mới vẫn phải kiểm tra trên commit cuối. Lỗi `/private/var` đã được giải quyết trong kiểm thử, không còn dùng báo cáo thất bại cũ.
- **Kiểm thử mới**: `tests/desktop-image-annotations.test.cjs`, `tests/desktop-hidden-ai-prompt-transport.test.cjs` và test click I18 trong `tests/browser-smoke.cjs`; đối chiếu kết quả CI tương ứng trước khi gọi hoàn tất.
- **F06 đã ẩn theo yêu cầu mới nhất**. Bất cứ mô tả F06 cũ nào còn lại ở file lịch sử đều không làm Node đó được hiển thị lại.

**Đích rà soát:** khi AI khác đánh dấu PASS cho một mã, bắt buộc phải có code thực thi, kết quả hiển thị thực tế và kiểm thử; chỉ có Prompt/ảnh mock hoặc tên nút thì chưa đủ.
