# TechVN Store 

Ứng dụng web thương mại điện tử xây dựng với **React 19 + TypeScript + Vite**, Tailwind CSS 4 và Radix UI. Dự án cung cấp trải nghiệm mua sắm đầy đủ: duyệt sản phẩm, bộ lọc/sắp xếp, giỏ hàng, thanh toán nhiều bước, hồ sơ người dùng và trợ lý chat gợi ý sản phẩm.

## Cách chạy nhanh
- Yêu cầu Node 18+.
- Cài gói: `npm install`
- Phát triển: `npm run dev` (Vite trên http://localhost:5173)
- Build production: `npm run build` → tạo `dist/`
- Kiểm tra lint: `npm run lint`

### Biến môi trường
Sử dụng API backend tại `http://localhost:5000/api` (đã cấu hình sẵn trong `src/config/api.ts`). Nếu cần thay đổi, thêm file `.env` với biến `VITE_API_URL` và cập nhật axios config cho phù hợp.

## Kiến trúc & luồng dữ liệu
- `src/config/api.ts`: cấu hình axios, tự chèn Bearer token, tự refresh access token bằng refresh token; logout nếu refresh thất bại.
- Quản lý token: `src/utils/tokenManager.ts` (localStorage).
- Context & provider gói ở `src/App.tsx`: 
  - `AuthProvider` (đăng nhập/đăng ký, lưu user + tokens).
  - `CartProvider` (đồng bộ giỏ hàng với server, số lượng, xóa, clear).
  - `CheckoutProvider` (địa chỉ, phương thức thanh toán, ghi chú, kết quả đơn).
  - `ChatProvider` (trạng thái mở/đóng, phiên chat, danh sách tin nhắn).
- Router: `src/routes/AppRoute.tsx` với các trang chính: `/`, `/products`, `/product/:slug`, `/cart`, `/checkout`, `/search`, `/user/*`.

## Chức năng chính
- **Trang chủ** (`src/pages/home/HomePage.tsx`): banner, ưu điểm dịch vụ, thương hiệu nổi bật, danh mục, danh sách sản phẩm nổi bật, modal đăng nhập/đăng ký, nút chat.
- **Danh sách sản phẩm** (`src/pages/products/ProductPage.tsx`): lọc theo thương hiệu/danh mục/giá, sắp xếp (best seller, newest…), chuyển đổi dạng lưới/danh sách, phân trang, breadcrumb động theo brand/category/search.
- **Chi tiết sản phẩm** (`src/pages/products/ProductDetail.tsx`): gallery ảnh, giá/khuyến mãi, tình trạng kho, chọn số lượng, thêm giỏ, mô tả, thông số, đánh giá & điểm trung bình, sản phẩm liên quan.
- **Tìm kiếm & gợi ý**: hook `useSearch` gọi `SearchService` để gợi ý tức thì, điều hướng tới trang kết quả.
- **Giỏ hàng** (`src/pages/cart/CartPage.tsx`): chọn/bỏ chọn tất cả, tăng/giảm số lượng, xóa, tính tổng theo mục đã chọn, chuyển sang thanh toán với các item được chọn.
- **Thanh toán** (`src/pages/checkout/CheckoutPage.tsx`): lấy địa chỉ mặc định, chọn địa chỉ khác, chọn phương thức thanh toán (COD/MoMo/VNPay), ghi chú, tính phí ship (miễn phí nếu ≥ 5.000.000đ), tạo đơn và dọn giỏ cho các item đã thanh toán.
- **Tài khoản người dùng** (`/user/*`): form hồ sơ, upload avatar (giới hạn 1MB, JPEG/PNG), đổi mật khẩu, danh sách địa chỉ (thêm/sửa/xóa, cờ mặc định), đơn hàng gần đây, thông báo.
- **Trợ lý chat gợi ý sản phẩm** (`src/components/chat/*`): hộp chat nổi, nhớ phiên bằng `sessionStorage`, gọi `ChatService` để nhận reply và sản phẩm gợi ý, hiển thị sản phẩm trong bong bóng bot.
- **Đánh giá sản phẩm**: hook `useProductReviews` lấy thống kê & danh sách đánh giá qua `ReviewService`.

## Thư mục đáng chú ý
- `src/components/`: UI thành phần chia theo miền (home, product, category, cart, profile, chat, layout, common, ui).
- `src/pages/`: trang hoàn chỉnh cho home, products, product detail, cart, checkout, user.
- `src/services/`: lớp gọi API theo miền (Auth, Product, Search, Category, Brand, Cart, Address, Checkout, Review, Chat, Home). Mỗi service trả về kiểu dữ liệu TypeScript tương ứng trong `*Types.ts`.
- `src/hooks/`: hook đặc thù nghiệp vụ (cart, checkout, address, profile, search, product list, product reviews, page type).
- `src/utils/`: tiện ích token, session chat, slugify, xử lý đơn hàng.
- `src/contexts/`: context cho auth, cart, checkout.
- `src/index.css`: thiết lập Tailwind + kiểu dáng chung.

## Dòng chính nghiệp vụ
1) Người dùng đăng nhập → `AuthProvider` lưu token & user; axios interceptor đính kèm token và tự refresh khi 401.
2) Duyệt sản phẩm: `useProductList` kết hợp filter/sort/search, đồng bộ query string → `ProductGrid` hiển thị.
3) Thêm giỏ hàng: `CartProvider` gọi `CartService`, cập nhật state và số lượng.
4) Checkout: `CartPage` truyền `selectedItems` sang `CheckoutPage`; `CheckoutProvider.handleCheckout` dựng payload (địa chỉ, items, notes, payment) và gọi `CheckoutService`.
5) Chat: `ChatWidget` ↔ `ChatProvider` ↔ `ChatService`; sessionId được giữ trong `sessionStorage` qua `utils/session.ts`.

## Công nghệ chính
- React 19, React Router 7, React Hook Form + Zod (form validation ở các component auth/profile).
- Tailwind CSS 4 + Radix primitives; icon: `lucide-react`; tiện ích class `clsx`/`cva`.
- HTTP: axios, interceptors refresh token.

## Scripts & kiểm thử
- `npm run dev|build|preview|lint` như trên. Chưa có bộ test tự động; nên chạy lint trước khi commit.

## Ghi chú triển khai
- Yêu cầu backend sẵn sàng tại `http://localhost:5000/api` với các endpoint trong `src/services/*Service` (auth, products, search, cart, checkout, review, chat...).
- LocalStorage dùng cho token & user; SessionStorage cho session chat; cần HTTPS + Secure Storage khi triển khai thực tế.
- Một số string giao diện hiện đang mã hóa sai Unicode; cần đồng bộ encoding UTF-8 trong backend/DB nếu muốn hiển thị tiếng Việt chuẩn.
