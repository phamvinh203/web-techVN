## Tóm tắt thay đổi chatbot
- Thêm `ChatProvider` (context) để giữ `isOpen`, `messages`, `isLoading`, `sessionId` ở cấp app; giúp chatbot không bị reset khi chuyển trang.
- Bọc toàn bộ app bằng `ChatProvider` và gắn `ChatWidget` ở `src/App.tsx` để widget nổi luôn tồn tại giữa các route.
- Sửa `ChatWidget` dùng context, bỏ lưu lịch sử localStorage; badge “tin mới” tính toán qua state có sẵn, không dùng setState trong effect.
- Mở rộng `ChatBubble` hiển thị `ProductCard` khi bot reply kèm sản phẩm.
- Tạo `ProductCard` mới hiển thị ảnh, tên, nút “Xem chi tiết” và điều hướng bằng React Router (ưu tiên slug, fallback id/_id).
- Cập nhật `chat.types.ts` cho response mới `{reply, product|null, sessionId}` và message chứa `product?`.
- Cập nhật `chatService.ts` nhận/ghi `sessionId`, parse product, dùng body `{ message, sessionId }`.
- Viết lại `session.ts` chỉ lưu `chat_session_id` bằng `sessionStorage`, không lưu messages.

## Tác dụng của ChatProvider
- Giữ trạng thái chat trong bộ nhớ chung của ứng dụng, tránh mất phiên/messages khi điều hướng.
- Cung cấp API thống nhất (`openChat`, `closeChat`, `sendMessage`) cho widget và các thành phần khác nếu cần mở chat từ nơi khác.
- Quản lý `sessionId` xuyên trang: tự đọc/lưu từ sessionStorage và đính kèm khi gọi API.
- Giảm phụ thuộc localStorage/history, đơn giản hóa render và đảm bảo UI đồng bộ với dữ liệu phản hồi (reply + product).
