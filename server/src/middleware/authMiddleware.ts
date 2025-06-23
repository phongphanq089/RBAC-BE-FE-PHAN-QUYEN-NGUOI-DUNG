import { Role } from '@/models/role.model'
import { User } from '@/models/user.model'
import { JWTPayload } from '@/types'
import {
  AppError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors'
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: any
  }
}

export interface AuthRequest extends RouteGenericInterface {
  user: JWTPayload
  currentUser?: any
}

// ====== hiện tại trong tất cả các logic thì chỉ tạo ra token trả về client rồi từ client lưu lại để mỗi lần request gọi api thì đính kèm beaer token để verify thôi chứ chưa đưa vào logic chuẩn bảo bât jwt vì đẩy chủ yếu tập trung vào chức năng phân quyền
export async function authenticate(
  request: FastifyRequest<AuthRequest>,
  reply: FastifyReply
): Promise<void> {
  try {
    // Fastify JWT sẽ tự động đọc token từ Authorization: Bearer <token> trong header.
    await request.jwtVerify()

    //Nếu token hợp lệ, Fastify sẽ giải mã (decode) và gán payload vào request.user.
    const payload = request.user as JWTPayload

    // Get user information from token
    const user = await User.findById(payload.userId)

    // Kiểm tra xem user có tồn tại và đang hoạt động không
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive')
    }

    request.currentUser = user
  } catch (err: any) {
    if (err.statusCode) {
      throw new AppError('Invalid token', 401)
    }

    throw new UnauthorizedError('Invalid or expired token')
  }
}

// Permission-based authorization middleware
export function authorize(requiredPermissions: string[] = []) {
  return async function (
    request: FastifyRequest<AuthRequest>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.currentUser) {
      throw new UnauthorizedError('Authentication required')
    }

    if (requiredPermissions.length === 0) {
      return // No specific permissions required
    }

    // Get user permissions
    // Lấy role thừ client để kiểm tra xem role hiện tại là gì để lấy ra các quyền theo role đã được định nghĩa sẵn ,
    const userPermissions = await Role.getRolePermissions(
      request.currentUser.role
    )
    //  lấy ra các thông tin của các role userPermissions thì map ra để lấy các vd [ 'user:read:own', 'user:update:own' ]
    const userPermissionNames = userPermissions.map((p) => p.name)
    console.log(request.currentUser.role)
    // Check if user has all required permissions
    //  check xem các permissions của user có khớp với userPermissionNames bên route khai báo không hiện tại không
    const hasAllPermissions = requiredPermissions.every((perm) => {
      return userPermissionNames.includes(perm)
    })

    if (!hasAllPermissions) {
      throw new ForbiddenError(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
      )
    }
  }
}

// Role-based authorization middleware
export function requireRole(allowedRoles: string[] = []) {
  return async function (
    request: FastifyRequest<AuthRequest>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.currentUser) {
      throw new UnauthorizedError('Authentication required')
    }

    if (allowedRoles.length === 0) {
      return // No specific roles required
    }

    if (!allowedRoles.includes(request.currentUser.role)) {
      throw new ForbiddenError(
        `Insufficient role privileges. Required: ${allowedRoles.join(
          ', '
        )}, Current: ${request.currentUser.role}`
      )
    }
  }
}

// Ownership-based authorization middleware
// phần trung gian kiểm tra quyền sở hữu của người dùng đó , bằng cách lấy id để check
export function requireOwnership(resourceIdParam: string = 'id') {
  return async function (
    request: FastifyRequest<AuthRequest>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.currentUser) {
      throw new UnauthorizedError('Authentication required')
    }

    const resourceId = (request.params as any)[resourceIdParam]
    const userId = request.currentUser._id

    // Super admin and admin can access all resources  === kiểm tra xem user lúc mà currentUser được lấy từ request khi mà decode ra có khớp với  'super_admin', 'admin' hay ko
    if (['super_admin', 'admin'].includes(request.currentUser.role)) {
      return
    }

    // Check ownership   ==== nếu ko khớp thì sẽ ko đủ quyền hạn
    if (resourceId !== userId) {
      throw new ForbiddenError('Access denied: not resource owner')
    }
  }
}

// Enhanced ownership check with role-based exceptions
// kiểm tra xem client user có đủ quyền admin , hoặc  super_admin hay ko
export function requireOwnershipOrRole(
  allowedRoles: string[] = ['admin', 'super_admin'],
  resourceIdParam: string = 'id'
) {
  return async function (
    request: FastifyRequest<AuthRequest>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.currentUser) {
      throw new UnauthorizedError('Authentication required')
    }

    // If user has allowed role, skip ownership check
    if (allowedRoles.includes(request.currentUser.role)) {
      return
    }

    const resourceId = (request.params as any)[resourceIdParam]
    const userId = request.currentUser._id

    // Check ownership for non-privileged users
    if (resourceId !== userId) {
      throw new ForbiddenError(
        'Access denied: not resource owner and insufficient role'
      )
    }
  }
}

export const forbidSelfDelete = async (
  request: FastifyRequest<AuthRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params as any

  if (request.currentUser._id === id) {
    throw new AppError('You can not delete yourseft', 403)
  }
}

// middle này có tác dụng ngăn việc xoá chính bản thân tránh mất mát dữ liệu , không có quyền chỉnh sửa hoặc gán  người có vai trò cao hơn vai trò của mình.
export async function forbidRoleChange(
  request: FastifyRequest<AuthRequest>,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string }
  const body = request.body as { role?: string }

  const currentUser = request.currentUser
  const targetUser = await User.findById(id)
  if (!targetUser) {
    throw new NotFoundError('Người dùng không tồn tại')
  }

  const currentRole = await Role.findByName(currentUser.role)
  const targetRole = await Role.findByName(targetUser.role)

  if (!currentRole || !targetRole) {
    throw new AppError('Không tìm thấy thông tin vai trò', 400)
  }

  // ❌ Không cho sửa chính mình
  if (currentUser._id === targetUser._id) {
    throw new ForbiddenError(
      'Không thể cập nhật thông tin của chính bạn tại đây'
    )
  }

  // ❌ Nếu vai trò hiện tại có priority thấp hơn người bị sửa => cấm
  if (currentRole.priority < targetRole.priority) {
    throw new ForbiddenError(
      `Bạn không có quyền chỉnh sửa người có vai trò cao hơn (${targetUser.role})`
    )
  }

  // ❌ Nếu đang muốn đổi sang role khác
  if (body.role && body.role !== targetUser.role) {
    const newRole = await Role.findByName(body.role)
    if (!newRole) {
      throw new AppError(`Vai trò '${body.role}' không tồn tại`, 400)
    }

    // ❌ Nếu role mới có priority cao hơn người gửi request => cấm
    if (newRole.priority > currentRole.priority) {
      throw new ForbiddenError(
        `Bạn không thể gán vai trò '${body.role}' có cấp cao hơn vai trò hiện tại`
      )
    }
  }
}
