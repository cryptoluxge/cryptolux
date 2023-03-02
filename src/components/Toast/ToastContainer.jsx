import { useToastStateContext } from 'context/ToastContext'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts } = useToastStateContext()
  return (
    <div className='fixed top-10 right-1 md:right-3 w-[350px] z-50'>
      <div className='max-w-xl mx-auto'>{toasts && toasts.map((toast) => <Toast id={toast.id} key={toast.id} type={toast.type} title={toast.title} message={toast.message} txHash={toast.txHash} />)}</div>
    </div>
  )
}
