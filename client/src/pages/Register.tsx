/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '~/store/auth'

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
  })
  const [error, setError] = useState('')
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6'>Register</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Username</label>
            <input
              type='text'
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded'
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
