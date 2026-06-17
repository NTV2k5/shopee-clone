# Shopee Clone (Next.js + Strapi)

Dự án Shopee Clone được xây dựng với Next.js (Frontend) và Strapi (CMS Backend).

## Cấu trúc thư mục
- `/frontend`: Next.js application.
- `/backend`: Strapi CMS application.

## Hướng dẫn chạy local

### 1. Backend (Strapi 5)
1. Truy cập thư mục backend: `cd backend`
2. Tạo file `.env` từ `.env.example` (nếu có) và điền thông tin:
   ```
   CLOUDINARY_NAME=your_name
   CLOUDINARY_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   DATABASE_FILENAME=.tmp/data_ecommerce.db
   ```
3. Cài đặt dependency: `npm install`
4. Chạy development: `npm run develop`
5. Tạo tài khoản admin tại `http://localhost:1337/admin`.
6. Vào **Settings -> API Tokens** và tạo một Full Access token nếu cần (hiện tại dự án đang config API public).

### 2. Frontend (Next.js 16.2.6 + React 19.2)
1. Truy cập thư mục frontend: `cd frontend`
2. Tạo file `.env.local`:
   ```
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
   ```
3. Cài đặt dependency: `npm install`
4. Chạy development: `npm run dev`
5. Truy cập `http://localhost:3000`.

## Triển khai (Deployment)

### Backend (Render)
1. Push code lên GitHub.
2. Trên Render, chọn "New -> Blueprint" và kết nối với repo này.
3. Render sẽ tự động config dựa trên file `backend/render.yaml`.
4. Đừng quên config các biến môi trường Cloudinary trên Render Dashboard.

### Frontend (Vercel)
1. Kết nối repo GitHub với Vercel.
2. Cấu hình "Root Directory" là `frontend`.
3. Thêm các biến môi trường:
   - `NEXT_PUBLIC_STRAPI_URL`: URL của backend trên Render.
   - `NEXT_PUBLIC_STRAPI_API_URL`: URL của backend trên Render kèm `/api`.

## Tính năng đã thực hiện
- [x] Quản lý Product với Strapi (Name, Description, Price, Slug, Image, Variants).
- [x] Form Create/Edit Product chuẩn Shopee UI.
- [x] Upload ảnh trực tiếp lên Cloudinary.
- [x] Hiển thị danh sách sản phẩm.
- [x] Trang chi tiết sản phẩm theo Slug.
- [x] Tối ưu SEO và Responsive.
