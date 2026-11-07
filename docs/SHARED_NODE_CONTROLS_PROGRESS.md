# BÁO CÁO MỞ RỘNG NÚT DÙNG CHUNG — 2026-11-08

**Phạm vi được người dùng yêu cầu:** Những nút giống nhau ở 9 Node phải có **cùng giao diện và cùng cách hoạt động**. Áp dụng lên Node thực tế; sau đó báo các nút chuyên biệt còn thiếu đặc tả. Không gọi ảnh mock là hoàn thiện ứng dụng.

**Đọc cùng:** [NODE_BUTTON_INVENTORY.md](NODE_BUTTON_INVENTORY.md), [AI_HANDOFF_REPORT.md](AI_HANDOFF_REPORT.md), [../AGENTS.md](../AGENTS.md).

## 1. Code đã ghi vào GitHub `main`

| Nhóm | Các mã yêu cầu V3 | Tầng code dùng chung / gắn vào hiện trạng 0.31.0 | Tình trạng |
|---|---|---|---|
| C01 — Chọn AI / model / tab | T06, S06, I06, V06, A05 | `node-common-actions.js` picker tối màu; lấy provider từ `WorkflowAI.providers`, tab từ `aiChatTabs`, chỉ render mục `providerHealth.ready`; model API từ `WorkflowAI.models`. Trên node text/script/image/video legacy có Prompt. | 🟡 Cần thử tab thực tế, không có fake model. |
| C02 — Dịch chữ Prompt Việt ↔ Anh | T07, S07, A09 | `shared-node-controls.js` dùng chung, `translateNodeDraft` chọn AI text đã kết nối; chỉ cập nhật textarea, có hoàn tác. | 🟡 Chưa kiểm thử AI dịch thật. |
| C03 — Gửi Prompt ↑ | T08, S08, I21, V19, D04, E15, A11 | `node-common-actions.js` chung giao diện trạng thái trắng / spinner / đỏ; `app.js` route sang `runSingleNode` (image/video/text), `execute` (voiceover) hoặc gửi văn bản có lưu kết quả riêng cho prompt/script. | 🟡 Chỉ các runtime loại cũ tồn tại; F05/F06/F07 V3 chưa có backend đầy đủ. |
| C04 — Prompt thường ↔ mở rộng | T09, S09, I22, V21, D09, E16, A13 | `shared-node-controls.js`; editor lớn ở lớp phủ Canvas, giữ text + **di chuyển chính các nút model/ref/gửi đang dùng** sang footer thay vì clone vô hiệu; trả về khi đóng. | 🟡 Chưa test browser end-to-end hoặc screen-space zoom V3. |
| C05 — Chọn tham chiếu | T04, S05, I02/I03, V02/V03, D03, A02/A03, E01 | Cùng menu Canvas / upload cục bộ với kiểm tra loại cổng; tận dụng `connect`, `portCompatible`, `importMediaFiles` trên Node có input media thật. “Kho tài sản cá nhân” chưa có selector, nút disabled có giải thích. | 🟡 Chưa hoàn thiện kho tài sản/histories. |
| C06 — Tải kết quả | S01, I19, V17, D08, E12, U06/U18 | Dùng cùng action tải ảnh/video/audio từ output hoặc `.txt` từ script có sẵn. Không hiển thị download khi không có kết quả hợp lệ. | 🟡 Chưa thử media cross-origin/Electron. |
| C07 — Xem lớn / Zoom | I20, V18, E13, U07/U19 | Chung lightbox xem ảnh/video/audio. Hiện nút toolbar khi Node được chọn. | 🟡 Chưa test pointer/keyboard đầy đủ. |
| C08 — Nhân bản Node | I17, E10, U05/U17 | Dùng `cloneNodeBundle` của repo, ID mới, dữ liệu nhập và dây vào còn hợp lệ. | 🟡 Chưa test khôi phục và side-effect đủ loại Node. |

**ĐÃ SỬA thêm:** Node `generateText`, `generateImage`, `generateVideo` có ô `localPrompt`; hàm `resolvePrompt` nối nội dung nhập tại chỗ với các Prompt được nối dây, không ghi đè input cũ. Các control mới được attach tại `renderNode` trên Canvas thật. Nút công cụ ngữ cảnh chỉ hiện với class `selected`; click vào textarea/input chọn Node.

**Chưa thay các Node V3 chưa tồn tại trên `main` thành các UI giả.** Hệ thống mới hoạt động theo capability của những Node hiện hữu (prompt, masterScript, storyPrompt, generateText/image/video, voiceover, media input/preview…). Chưa có Node 3D Director thực, Smart Edit V3, Audio AI tạo nhạc tổng quát trên `main`; không được nói đã hỗ trợ 9 Node V3 hoàn toàn.

### Bảo đảm build / dữ liệu

- `app.html` tải cả `shared-node-controls.js/.css`, `node-common-actions.js/.css`.
- `tools/package.py` **đã thêm 4 tệp trên** để file ZIP extension không thiếu các thành phần.
- Kiểm thử tự động mới: `tests/desktop-node-common-controls.test.cjs`, `tests/desktop-shared-node-wiring.test.cjs`, `tests/desktop-shared-node-controls.test.cjs`.
- **GitHub Actions macOS CI** đã đạt `98 pass / 1 fail` trên 99 bài trước khi thêm bài kiểm tra wiring (cần kiểm tra CI mới nhất). Lỗi còn lại là **BUG-007** trong test path `/private/var` vs `/var`, đã tồn tại trước lần sửa Node. Không được ghi "CI xanh".
- **Chưa chạy** `npm run test:browser`, `npm run test:reliability`, `npm run test:desktop` sau lần sửa trên một bản GitHub HEAD mới nhất; chưa có ảnh chụp *ứng dụng đầy đủ đang chạy* để chứng minh UI V3; chưa thử dịch / Muse / OpenAI với tài khoản thật.
- Chưa xác minh **Prompt thường không đổi kích thước khi zoom Canvas** ở mọi Node (requirement quan trọng); hiện bộ `localPrompt` nằm trong node legacy và còn chịu Canvas scale. Việc cố định kích thước screen-space của composer V3 cần đợt triển khai riêng.

## 2. Nút chuyên biệt CẦN người dùng giải thích thêm

Các nhóm dùng chung C01–C08 đã được chốt. Các mục dưới đây cần mô tả thêm *hành vi đầu vào / đầu ra*, không nhất thiết cần gửi lại ảnh đã có.

| Node | Mã | Cần giải thích cụ thể |
|---|---|---|
| F01 Văn bản | T04 | Khi suy ngược Prompt từ nhiều ảnh: gộp thành một Prompt hay trả một Prompt/ảnh? Kết quả ghi đè văn bản hay tạo khối kết quả riêng? |
| F02 Kịch bản | S01 | Ba mục **Tạo hình ảnh nhân vật / Tạo đồ thị cảnh / Tạo ảnh sản phẩm** và **Sáng tạo toàn năng**: mỗi mục sinh bao nhiêu Node ảnh/tài nguyên; dữ liệu nào chuyển tiếp? |
| F02 Kịch bản | S03, S10 | Bảng phân cảnh 3 bước (Xác nhận ống kính / Chuẩn bị tài sản / Tổng hợp): điều kiện để qua bước và đầu ra cuối là JSON, shot list hay loạt Node? |
| F03 Sinh ảnh | I04, I05 | Đánh dấu đối tượng và chọn phong cách: cơ chế đánh dấu, lưu và áp dụng tới Prompt/ảnh như thế nào? |
| F03 Sinh ảnh | I10–I15, I18 | Chỉnh sửa phần tử, HD, nhiều góc độ, phân lưới, tách lớp, toàn cảnh 720°, vẽ đánh dấu: mỗi công cụ nhận ảnh nào và tạo output nào? Backend nào hỗ trợ? |
| F04 Sinh video | V05, V10–V14 | Góc máy, chuyển động sâu, HD, xóa phụ đề, làm lại đoạn, tách âm thanh: thao tác lên đoạn nào, đầu ra/giới hạn gì? |
| F05 Đạo diễn | D01, D05–D08 | Editor 3D thật hay trình điều khiển dịch vụ bên ngoài? Di chuyển camera, lưu nhiều góc máy, snapshot và xuất ra đâu? |
| F06 Smart Edit | E03–E07, E11, E14 | Quy tắc từng preset, lựa chọn kiểu chỉnh sửa, cắt khung, timeline: xác định bước và định dạng output; editor nội bộ hay mở một công cụ khác? |
| F07 Âm thanh | A04, A08, A10–A12 | “Âm thanh → Video” dùng audio để tạo chuyển động hay tạo ảnh đi kèm? Cách chọn giọng, sample rate, định dạng, player và model âm thanh nào? |
| R01/R02 tài nguyên | U10, U21 | Có dùng **chính bộ công cụ ảnh/video F03/F04** trên media upload, hay chỉ những tác vụ không cần AI? |
| Dùng chung | C05 — Kho tài sản | Kho tài sản/lịch sử nào là nguồn dữ liệu chuẩn? Có chọn tài nguyên bằng drag/drop hay menu, và phiên bản follow/freeze hoạt động thế nào? |

## 3. Tiếp theo (cần được duyệt riêng theo quy trình)

1. Chạy test browser/desktop thực với dữ liệu mẫu (tập trung mở/đóng Prompt, chọn tab AI, kết nối media, nhân bản, download, tạo trạng thái lỗi).
2. Chốt và dựng **composer V3 neo Node nhưng bất biến kích thước khi Canvas zoom**, tránh lệch/giật.
3. Dựng các Node V3 còn thiếu; dùng lại C01–C08, không copy/paste logic. Chỉ triển khai công cụ AI riêng khi có mô tả/endpoint.
4. Chụp UI thực từ app chạy, cập nhật bảng xanh/vàng/đỏ và commit riêng cho mỗi phần.

## 4. Nhật ký commit

Tham khảo lịch sử commit của các file: `app.js`, `app.html`, `node-common-actions.js/.css`, `shared-node-controls.js/.css`, `tools/package.py`, và `tests/desktop-*.test.cjs`. Trong bước này không thay đổi `nodeDefs` cho những Node V3 chưa có backend; giữ backward compatibility cũ.

**Trạng thái tổng thể của toàn bộ 9 Node V3: 🟡 CHƯA HOÀN THÀNH**. Phần lõi dùng chung đã được thêm vào những Node thực tế có khả năng tương ứng.


## 5. CI cập nhật sau khi sửa kiểm thử (2026-11-08)

- **Bằng chứng:** [GitHub Actions run #42407579737](https://github.com/mktminhqpbga-glitch/workflow/actions/runs/42407579737), commit code/test `60ae092980b729c32b1003e341b040aed99e8ff4`.
- Kết quả `npm test` trên macOS: **102 test, 101 pass, 1 fail**. Các kiểm thử mới về node actions/đóng gói/shared Prompt đã qua.
- Bài còn lỗi: `tests/desktop-policy.test.cjs:73` — lỗi đường dẫn canonical `/private/var` so với `/var` (BUG-007 đã có trước). Không sửa bảo vệ đường dẫn trong đợt này.
- `npm run test:browser`, `npm run test:desktop`, `npm run test:reliability` và thử AI thật: **chưa chạy**. Chưa có bằng chứng screenshot từ app GitHub HEAD đã chạy. Vì vậy status vẫn 🟡.
- Các commit phần tính năng: `5d01ed5d02da`, `8261d0de035b`, `0cde487f6860`, `74f9eb499d9f`, `0f96f2473513`, `7bcdf99144ed`, `934b97b6d6ed`, `5c8de103ec53`, `facd4493aa14`, `c1e741dd9a0d`, `aef2f88d909d`, `be79ff07744c`, `2219f9dda0a0`. Các SHA đầy đủ tra lịch sử GitHub.
