export const permissionMap: Record<string, string> = {
  'user:read:own': 'Xem thông tin cá nhân',
  'user:update:own': 'Cập nhật thông tin cá nhân',
  'user:delete:own': 'Xoá tài khoản cá nhân',

  'user:read:all': 'Xem danh sách người dùng',
  'user:create:all': 'Tạo người dùng mới',
  'user:update:all': 'Cập nhật người dùng',
  'user:delete:all': 'Xoá người dùng',

  'role:read:all': 'Xem danh sách vai trò',
  'role:create:all': 'Tạo vai trò mới',
  'role:update:all': 'Cập nhật vai trò',
  'role:delete:all': 'Xoá vai trò',

  'content:read:all': 'Xem toàn bộ nội dung',
  'content:moderate:all': 'Kiểm duyệt nội dung',

  'system:admin:all': 'Quyền quản trị hệ thống toàn phần',
}
