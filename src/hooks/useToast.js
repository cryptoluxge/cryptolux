import { useToastDispatchContext } from '../context/ToastContext'

export function useToast() {
  const dispatch = useToastDispatchContext()

  function toast(type, title, message, txHash) {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({ type: 'ADD_TOAST', toast: { type, title, message, txHash, id } })

    setTimeout(() => {
      dispatch({ type: 'DELETE_TOAST', id: id })
    }, 6000)
  }

  return toast
}
