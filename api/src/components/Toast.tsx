interface ToastProps {
  message: string
  show: boolean
}

function Toast({ message, show }: ToastProps) {
  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
      px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 
      animate-in fade-in slide-in-from-bottom-4"
    >
      {message}
    </div>
  )
}

export default Toast 