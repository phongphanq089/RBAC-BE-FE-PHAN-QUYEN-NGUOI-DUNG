# 🔐 RBAC Fullstack - Phân quyền người dùng

Đây là một dự án học tập nhỏ được xây dựng để thực hành mô hình **RBAC (Role-Based Access Control)** trong hệ thống fullstack. Dự án mô phỏng hệ thống phân quyền người dùng dựa theo vai trò và quyền hạn, giúp kiểm soát truy cập chi tiết đến từng tài nguyên của ứng dụng.

---

## 🚀 Tính năng chính

- ✅ Xác thực người dùng bằng JWT (login, logout, refresh token).
- ✅ Đăng ký, cập nhật, xoá tài khoản (mềm & vĩnh viễn).
- ✅ Phân quyền dựa trên vai trò (`role`) và quyền (`permission`).
- ✅ Middleware bảo vệ route: xác thực, kiểm tra quyền, kiểm tra sở hữu.
- ✅ Seeding dữ liệu tự động khi khởi tạo lần đầu (permissions, roles, super admin).

---

## 🧱 Công nghệ sử dụng

- **Backend**: Fastify + TypeScript
- **Cơ sở dữ liệu**: `nedb-promises` (dạng file, không cần cài đặt DBMS)
- **Mã hóa mật khẩu**: `bcrypt`
- **Xác thực**: JWT + Session Token lưu trữ nội bộ
- **Validate dữ liệu**: `zod`

---

## 📁 Cấu trúc chính

- `database.ts`: Khởi tạo cơ sở dữ liệu, tạo các bảng ảo và dữ liệu mẫu
- `authRoutes.ts`: Xử lý API liên quan đến người dùng (đăng ký, đăng nhập, profile, xoá, cập nhật…)
- `roleRoutes.ts`: API quản lý vai trò (tạo, sửa, xoá role, gán quyền…)
- `permissionRoutes.ts`: API truy xuất quyền theo tài nguyên

---

## 👮‍♂️ Các vai trò mặc định

| Vai trò       | Mô tả                                                            |
| ------------- | ---------------------------------------------------------------- |
| `client`      | Chỉ được truy cập và cập nhật thông tin cá nhân                  |
| `moderator`   | Duyệt nội dung, xem tất cả user                                  |
| `admin`       | Quản lý toàn bộ user và roles, không có quyền xoá user vĩnh viễn |
| `super_admin` | Toàn quyền hệ thống, bao gồm cả xoá user khỏi DB                 |

---

## 🧪 Khởi tạo mặc định

Sau khi khởi chạy lần đầu, hệ thống sẽ tự động:

- Tạo sẵn danh sách các `permissions` cơ bản.
- Tạo các `roles`: `client`, `moderator`, `admin`, `super_admin`.
- Tạo tài khoản super admin mặc định:

![Logo RBAC](https://phongph.netlify.app/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fi6rvgdeu%2Fproduction%2Ff6ec1a80e3accdc7c8620b02018bcc92f7639ce9-2048x1222.jpg&w=1920&q=75)
