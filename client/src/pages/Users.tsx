/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useAppStore } from '~/store/auth'

export const Users = () => {
  const {
    roles,
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    deleteUser,
    fetchPermissions,
    updateUser,
    fetchRoles,
  } = useAppStore()

  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [isEdit, setIsEdit] = useState(false)

  const [editData, setEditData] = useState({
    username: '',
    role: '',
  })

  const handleUpdateUser = async (id: string) => {
    await updateUser(id, editData)
    await fetchUsers()
    setIsEdit(false)
  }

  const handleOpenDetail = async (id: string) => {
    await fetchPermissions()
    const user = await getUserById(id)
    setSelectedUser(user)
  }

  useEffect(() => {
    fetchRoles()
    fetchUsers()
  }, [fetchUsers, fetchRoles])

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='p-2'>Username</th>
            <th className='p-2'>Email</th>
            <th className='p-2'>roles</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className='border-b'>
              <td className='p-2'>{user.username}</td>
              <td className='p-2'>{user.email}</td>
              <td className='p-2'>{user.role}</td>
              <td className='p-2 flex gap-3'>
                <Dialog
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsEdit(false)
                      setEditData({ username: '', role: '' })
                      setSelectedUser(null)
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDetail(user.id)} size='sm'>
                      Chi tiết
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-lg font-semibold mb-2'>
                        Chi tiết người dùng
                      </h2>
                      <Edit
                        onClick={() => {
                          setEditData({
                            username: selectedUser.username,
                            role: selectedUser.role,
                          })
                          setIsEdit(true)
                        }}
                      />
                    </div>
                    {selectedUser && (
                      <>
                        <p>
                          <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                          {isEdit ? (
                            <input
                              type='text'
                              placeholder='Add new role'
                              value={editData.username}
                              className='border p-2 w-full'
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  username: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <>
                              <strong>Username:</strong> {selectedUser.username}
                            </>
                          )}
                        </p>
                        <p>
                          {isEdit ? (
                            <Select
                              onValueChange={(value) =>
                                setEditData({ ...editData, role: value })
                              }
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Chọn role...' />
                              </SelectTrigger>
                              <SelectContent className='w-full'>
                                {roles.map((role) => (
                                  <SelectItem key={role.name} value={role.name}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <>
                              <strong>Role:</strong> {selectedUser.role}
                            </>
                          )}
                        </p>
                      </>
                    )}

                    {isEdit && (
                      <Button
                        className='w-full mt-4'
                        onClick={() => handleUpdateUser(selectedUser.id)}
                      >
                        Update
                      </Button>
                    )}
                  </DialogContent>
                </Dialog>

                <button
                  onClick={() => deleteUser(user.id)}
                  className='bg-red-500 text-white px-2 py-1 rounded'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
