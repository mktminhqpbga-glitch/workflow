# AGENTS.md — Hướng dẫn AI làm việc với Workflow / MuseFlow

## BẮT BUỘC ĐỌC TRƯỚC KHI SỬA

1. **docs/AI_HANDOFF_REPORT.md** — yêu cầu của chủ dự án, trạng thái 9 Node, luồng Canvas, danh sách T-001–T-016 và BUG-001–BUG-006.
2. **README.md** — cách chạy/cài đặt và trạng thái bản phát hành hiện tại.
3. **docs/APP-ARCHITECTURE.md** — kiến trúc extension / Electron / graph / persistence / relay.
4. **docs/PROGRESS.md** — những chức năng đã được repo trước đây kiểm tra và những giới hạn test.

## Quy tắc thực hiện nhiệm vụ

- Không coi bản thử nghiệm MuseFlow V3 trong hội thoại là đã merge vào GitHub. Xác minh nhánh, commit, version, file và test hiện có trước khi sửa.
- Mỗi lần làm việc chọn nhiệm vụ trong bảng T-xxx / BUG-xxx của docs/AI_HANDOFF_REPORT.md; kiểm tra được lỗi thì tái hiện, sửa, chạy kiểm thử, rồi ghi kết quả vào báo cáo.
- Không đánh dấu hoàn thành chỉ vì đã có ảnh hay mock giao diện. Xanh = UI + chức năng **được kiểm tra**; vàng = chỉ một phần; đỏ = chưa có.
- Giữ backward compatibility với workflow cũ, lưu trữ tài sản, AI adapter, Electron/extension; không tự xóa logic cũ khi thay UI. Menu thêm mới có thể giới hạn 9 node theo yêu cầu nhưng phải xử lý workflow cũ an toàn.
- Chọn Node → hiện toolbar phù hợp nếu node hỗ trợ; bỏ chọn → ẩn; không tự mở context menu. Prompt đi kèm node, có thể thu gọn và xử lý zoom đúng.
- Không tự chạy lại AI do đầu vào nguồn thay đổi; tránh gọi dịch vụ tính phí ngoài ý muốn. Chỉ báo kết quả AI đã có khi thật sự nhận được đầu ra hợp lệ.
- Chức năng chưa được chủ dự án giải thích: ghi câu hỏi, không tự phán đoán hay tạo nút bấm giả.
- Ảnh gốc dùng thiết kế Node nằm trong hội thoại chứ chưa có trong repo; cần ảnh gốc để làm đúng pixel.
- Sau sửa chạy lệnh có thể chạy từ package.json: npm test; npm run test:browser; npm run test:reliability; npm run test:desktop. Ghi rõ test chưa chạy hoặc môi trường không hỗ trợ.
- Bảo vệ khóa API, cookie, dữ liệu người dùng; không ghi bí mật vào mã hoặc báo cáo, không tự gọi API có phí để test.
- Khi hoàn tất, cập nhật docs/AI_HANDOFF_REPORT.md (mã nhiệm vụ, commit, file thay đổi, cách thử, kết quả). Gửi hình xem trước khi user muốn duyệt UI; không xuất ZIP nếu user không yêu cầu.

**Lưu ý:** File này chỉ là hướng dẫn cho AI khi được giao nhiệm vụ; không tự tạo tiến trình sửa lỗi chạy nền.
