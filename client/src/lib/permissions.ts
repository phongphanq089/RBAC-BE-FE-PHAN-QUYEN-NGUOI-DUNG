export function hasPermission(
  userPermissions: string[],
  required: string | string[]
) {
  if (Array.isArray(required)) {
    return required.every((perm) => userPermissions.includes(perm))
  }
  return userPermissions.includes(required)
}
