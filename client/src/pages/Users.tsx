import { useEffect } from 'react'
import { useAppStore } from '~/store/auth'

export const Users = () => {
  const { users, loading, error, fetchUsers, deleteUser } = useAppStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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
            <th className='p-2'>Role</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className='border-b'>
              <td className='p-2'>{user.username}</td>
              <td className='p-2'>{user.email}</td>
              <td className='p-2'>{user.role}</td>
              <td className='p-2'>
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
