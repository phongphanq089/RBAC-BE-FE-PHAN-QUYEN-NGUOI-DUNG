/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useAuthStore } from '~/store/auth'

const Profile = () => {
  const { user, updateProfile } = useAuthStore()
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
    } catch (err: any) {
      setError(err.message)
    }
  }
  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>Profile</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form onSubmit={handleSubmit} className='max-w-md'>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Username</label>
          <input
            type='text'
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input
            type='email'
            disabled
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className='w-full p-2 border rounded'
          />
        </div>
        <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default Profile
