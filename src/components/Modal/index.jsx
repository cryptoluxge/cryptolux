import React, { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Index = ({ title, open, children, close, hideHeader, width }) => {
  const cancelButtonRef = useRef(null)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={close}>
        <Transition.Child as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-lightCard bg-opacity-75 transition-opacity' />
        </Transition.Child>
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <Dialog.Panel className={`${width ? width : 'w-full md:w-[450px]'} relative rounded-xl text-left overflow-hidden transform transition-all sm:my-8 border-[1px] border-lightBorder`}>
                <div className='relative bg-lightCard'>
                  {!hideHeader && (
                    <div>
                      <div className='flex justify-between items-center px-3 py-2'>
                        <p className='text-lightText font-semibold'>{title}</p>
                        <button onClick={close} type='button' className='text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-primary hover:text-white' data-modal-toggle='crypto-modal'>
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                            <path
                              fillRule='evenodd'
                              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                              clipRule='evenodd'></path>
                          </svg>
                        </button>
                      </div>
                      <div className='border-b border-lightBorder rounded-lg'></div>
                    </div>
                  )}
                  <div className='mt-2'>{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Index
