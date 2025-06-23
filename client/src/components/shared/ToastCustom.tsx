import { Bounce, ToastContainer } from 'react-toastify'

const contextClass = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-gray-600',
  warning: 'bg-orange-400',
  default: 'bg-indigo-600',
  dark: 'bg-white-600 font-gray-300',
}

const ToastCustom = () => {
  return (
    <ToastContainer
      position='top-right'
      autoClose={3000}
      // autoClose={false}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='colored'
      transition={Bounce}
      toastClassName={(context) =>
        contextClass[context?.type || 'default'] +
        ' ' +
        'relative flex pl-4 ml-[23px] pr-[35px] py-3 min-h-[55px] rounded-md justify-between items-center overflow-hidden cursor-pointer opacity-100 mb-2 z-50'
      }
    />
  )
}

export default ToastCustom
