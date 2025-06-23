import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export const Alert = ({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info'
  message: string
  onClose: () => void
}) => {
  const icons = {
    success: <CheckCircle className='w-5 h-5' />,
    error: <AlertCircle className='w-5 h-5' />,
    info: <Info className='w-5 h-5' />,
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div
      className={`flex items-center p-4 mb-4 border rounded-lg ${colors[type]}`}
    >
      {icons[type]}
      <span className='ml-2 flex-1'>{message}</span>
      <button onClick={onClose} className='ml-2 hover:opacity-70'>
        <X className='w-4 h-4' />
      </button>
    </div>
  )
}
