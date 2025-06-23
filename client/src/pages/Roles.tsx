import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { permissionMap } from '~/lib/permissionMap'
import { useAppStore } from '~/store/auth'

export const Roles = () => {
  const {
    roles,
    loading,
    error,
    fetchRoles,
    deleteRole,
    createNewRole,
    fetchPermissions,
    permissions,
    updateUserPermission,
  } = useAppStore()

  const [role, setRole] = useState('')

  const [selectRoleName, setSelectRoleName] = useState<string>('')
  const [selectedPermission, setSelectedPermission] = useState<string>('')

  const handleOpenDetail = async (name: string) => {
    await fetchPermissions()

    setSelectRoleName(name)
  }

  const handlePermissionChange = async (
    permission: string,
    type: 'add' | 'remove'
  ) => {
    await updateUserPermission(selectRoleName, permission, type)
    fetchRoles()
  }

  const handleAddnewRole = async () => {
    const payload = {
      name: role,
    }
    await createNewRole(payload)

    setRole('')
    fetchRoles()
  }

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return (
    <div>
      <div className='flex items-center justify-between '>
        <h1 className='text-3xl font-bold mb-4'>Roles</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>ADD NEW</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className='text-lg font-semibold mb-2'>ADD NEW ROLE</h2>
            <Input
              type='text'
              onChange={(e) => setRole(e.target.value)}
              placeholder='Add new role'
            />

            <Button onClick={handleAddnewRole}>ADD</Button>
          </DialogContent>
        </Dialog>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='p-2'>Name</th>
            <th className='p-2'>Description</th>
            <th className='p-2'>Permissions</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles?.map((role) => {
            return (
              <tr key={role._id} className='border-b'>
                <td className='p-2'>{role.name}</td>
                <td className='p-2'>{role.description}</td>
                <td className='p-2'>
                  {role.permissions.map((perm) => {
                    return (
                      <span key={`${perm}`}>{permissionMap[perm] || perm}</span>
                    )
                  })}
                </td>
                <td className='p-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleOpenDetail(role.name)}
                        size='sm'
                      >
                        Chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className='text-lg font-semibold mb-2'>
                        Chi tiết người dùng
                      </h2>
                      {selectRoleName && (
                        <>
                          <div className='mt-4'>
                            <p className='font-semibold'>Thêm quyền mới:</p>
                            <div className='flex items-center gap-2 mt-2'>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedPermission(value)
                                }
                              >
                                <SelectTrigger className='w-[240px]'>
                                  <SelectValue placeholder='Chọn quyền...' />
                                </SelectTrigger>
                                <SelectContent>
                                  {permissions.map((perm) => (
                                    <SelectItem
                                      key={perm.name}
                                      value={perm.name}
                                    >
                                      {perm.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                disabled={!selectedPermission}
                                onClick={() =>
                                  handlePermissionChange(
                                    selectedPermission,
                                    'add'
                                  )
                                }
                              >
                                Thêm
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  <button
                    onClick={() => deleteRole(role.name)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
