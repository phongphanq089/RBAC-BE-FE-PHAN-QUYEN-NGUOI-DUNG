import { useEffect } from 'react'
import { useAppStore } from '~/store/auth'

const Permissions = () => {
  const { permissions, loading, error, fetchPermissions } = useAppStore()

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>Permissions</h1>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='p-2'>Name</th>
            <th className='p-2'>Description</th>
            <th className='p-2'>Resource</th>
            <th className='p-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission._id} className='border-b'>
              <td className='p-2'>{permission.name}</td>
              <td className='p-2'>{permission.description}</td>
              <td className='p-2'>{permission.resource}</td>
              <td className='p-2'>{permission.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Permissions
