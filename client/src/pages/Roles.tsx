import { useEffect } from 'react'
import { permissionMap } from '~/lib/permissionMap'
import { useAppStore } from '~/store/auth'

export const Roles = () => {
  const { roles, loading, error, fetchRoles, deleteRole } = useAppStore()

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>Roles</h1>
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
          {roles.map((role) => (
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
                <button
                  onClick={() => deleteRole(role.name)}
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
