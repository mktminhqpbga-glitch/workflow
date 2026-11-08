# Kết nối AI

Mở **Cài đặt → Kết nối AI**, hoặc **＋ Thêm kết nối AI** trong bộ chọn model của node. Trang có tìm kiếm, bộ lọc và danh mục 16 nhà cung cấp. Một nhà cung cấp có thể có nhiều kết nối mang tên riêng; mỗi node chọn một kết nối cụ thể. Không tự chuyển tài khoản hoặc chuyển từ tab sang API khi lỗi.

## API

Chọn nhà cung cấp → API → nhập tên → chọn loại đầu ra → nhập model ID → nhập khóa → Lưu. Mỗi kết nối API gắn với một model và một loại đầu ra; tạo kết nối khác khi cần model/loại khác. Các model hiện có của Google/OpenAI/fal.ai vẫn được giữ để tương thích workflow cũ.

| Nhà cung cấp | Adapter hiện có |
|---|---|
| Google Gemini / Veo | Văn bản, ảnh, video; giới hạn đầu vào giữ nguyên như README |
| OpenAI | Văn bản/ảnh; adapter ảnh chưa nhận ảnh tham chiếu |
| fal.ai | Các tác vụ video nguồn được hỗ trợ sẵn, không phải mọi model trên fal.ai |
| Claude | Messages API, văn bản và ảnh đầu vào; đầu ra văn bản, tối đa 4096 token |
| DeepSeek, Qwen, Grok, Mistral, Perplexity | Chat Completions, chỉ văn bản; nhập model ID có quyền sử dụng |
| API tương thích OpenAI | Chat Completions văn bản tại các máy chủ được liệt kê trong form |

Qwen mặc định dùng endpoint quốc tế `dashscope-intl.aliyuncs.com/compatible-mode/v1`; khóa vùng khác không được mặc nhiên dùng chung. API tương thích chấp nhận HTTPS trên các host đã được giới hạn, ví dụ `https://openrouter.ai/api/v1` hoặc `https://api.together.xyz/v1`. Chưa hỗ trợ máy chủ tùy ý, localhost hoặc địa chỉ private. Redirect bị từ chối khi gửi khóa.

**Kiểm tra kết nối** chỉ đọc danh sách model khi API hỗ trợ; không gửi yêu cầu tạo nội dung. Kết quả kiểm tra không chứng minh model được phép tạo nội dung hoặc đủ hạn mức. fal.ai và Perplexity hiện chỉ lưu cấu hình, chưa có kiểm tra không tạo nội dung trong ứng dụng. Chạy node có thể phát sinh phí.

Tên kết nối/model/cấu hình lưu cục bộ. API key chỉ lưu trong `chrome.storage.session`, hoặc bộ nhớ phiên của Electron; không nằm trong metadata kết nối hoặc JSON workflow. Kết thúc phiên có thể phải nhập lại khóa. Khi mở quản lý, ô khóa để trống; để trống khi lưu giữ khóa hiện tại nếu còn trong phiên. Nút Hiện khóa chỉ hiện nội dung đang nhập.

## Tab trình duyệt / extension

Đang có bộ nối cho Muse, Gemini và ChatGPT. Mở website → đăng nhập → mở cuộc trò chuyện → chọn đúng tab trong form → Kiểm tra → Lưu. Có thể dùng extension trong Chrome hoặc các cửa sổ AI hiện được desktop hỗ trợ. Nếu dùng Chrome cùng desktop, ghép nối extension đồng hành theo `DESKTOP.md`.

Tab được lưu theo ID và URL cuộc trò chuyện. Tab đóng/đổi chat phải được chọn lại rõ ràng; không tự chuyển sang tab khác. Kiểm tra chỉ nhận diện ô nhập; chưa chứng minh tạo nội dung thành công. Không đổi chat trong lúc chạy. Bộ nối dừng an toàn nếu origin/path thay đổi, kể cả website tự cấp URL mới; nên mở chat có URL ổn định trước khi chạy.

Tab của Claude, DeepSeek, Qwen, Grok, Mistral và Perplexity chưa có adapter đã tích hợp. Replicate, Kling trực tiếp, Runway, Luma và ElevenLabs nằm trong danh mục nhưng chưa có adapter trực tiếp; nút lưu/chạy bị khóa. Kling Motion Control qua fal.ai vẫn sử dụng adapter fal.ai hiện có. Không hiển thị các mục chưa hỗ trợ là đã kết nối.

## Kiểm thử

- `npm test`: adapter API, tách metadata/khóa, URL, hủy, kết quả rỗng/bị cắt và các bài hiện có.
- `node tests/ai-connections-smoke.cjs`: UI thật trong Chromium, API/Chrome mô phỏng; nhiều tài khoản, chọn đúng key/model tại node, lưu/khôi phục, hết phiên và không xuất khóa vào workflow.
- `node tests/ai-conversation-smoke.cjs`: không nhận kết quả từ chat khác.
- `npm run test:browser`, `npm run test:reliability`, `npm run test:desktop`: hồi quy toàn ứng dụng.

Chưa dùng khóa/tài khoản thật để xác minh các nhà cung cấp mới. Giao diện website, quyền model, CORS và hạn mức tài khoản vẫn cần QA thực tế trước khi phát hành.
