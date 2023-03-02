import { Dialog, Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import Button from 'components/Button'
import { useToast } from 'hooks/useToast'
import { Fragment, useEffect, useRef, useState } from 'react'
import { getSyrupPoolContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import { getUserSyrupPoolData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
import Web3 from 'web3'

const DepositButton = ({ name, poolContract }) => {
  const mountedRef = useRef(true)
  const cancelButtonRef = useRef(null)
  const { account, active, chainId } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const [userBalance, setUserBalance] = useState()
  const toast = useToast()
  const web3 = new Web3(window.ethereum)
  const SyrupPoolContract = getSyrupPoolContract(poolContract, chainId)

  const setMAXcake = () => {
    document.getElementById('cakeToWithdraw').value = userBalance
  }

  const withdrawFromPool = async () => {
    const stakeValue = document.getElementById('cakeToWithdraw').value
    const cakeToWei = web3.utils.toWei(stakeValue, 'ether')
    if (Number(stakeValue) > Number(userBalance)) {
      toast('error', 'მეტს ვერ გამოიტანეთ')
    } else {
      await SyrupPoolContract.methods
        .withdraw(cakeToWei)
        .send({ from: account, gasLimit: 100000 })
        .once('transactionHash', (hash) => {
          toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
        })
        .on('error', (error) => {
          if (error.code === 4001) {
            toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
          } else if (error.code === -32003) {
            toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
          } else if (error.code === -32603) {
            toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
          } else {
            toast('error', 'არ დადასტურდა')
          }
        })
        .then((receipt) => {
          if (receipt.status === true) {
            toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', '', receipt.transactionHash)
          } else {
            toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა', '', receipt.transactionHash)
          }
        })
    }
  }

  const data = async () => {
    const getData = await getUserSyrupPoolData(poolContract, account, name)
    setUserBalance(getData.userStaked)
  }

  useEffect(() => {
    if (active === true && chainId === 56) {
      data(poolContract, name)
    }
    return () => {
      mountedRef.current = false
    }

    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>გამოტანა</Button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
          <Transition.Child as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-lightCard bg-opacity-75 transition-opacity' />
          </Transition.Child>
          <div className='fixed z-10 inset-0'>
            <div className='flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <Dialog.Panel className='relative rounded-lg text-left overflow-hidden transform transition-all sm:my-8'>
                  <div className='relative shadow bg-lightModal'>
                    <button
                      onClick={() => setIsOpen(false)}
                      type='button'
                      className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  '
                      data-modal-toggle='crypto-modal'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'></path>
                      </svg>
                    </button>
                    <div className='py-4 px-3 rounded-t border-b'>
                      <h3 className='text-lightText '>{name} სტეიკიდან გატანა</h3>
                    </div>
                    <div className='p-3'>
                      <div>
                        <label className='block mb-2 text-sm font-medium text-lightText'>რაოდენობა</label>
                        <div className='flex items-center gap-2'>
                          <input type='text' id='cakeToWithdraw' className='rounded-lg block w-full p-2.5 bg-gray-200    text-lightText ' placeholder='CAKE რაოდენობა' required />
                          <div onClick={() => setMAXcake()} className='bg-primary p-2 rounded-lg text-white duration-150 hover:bg-dark cursor-pointer'>
                            MAX
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-between items-center mt-3'>
                        <p className='block mb-2 text-sm font-medium text-lightText'>დასტეიკებული გაქვთ:</p>
                        <p className='block mb-2 text-sm font-medium text-lightText'>{Number(userBalance).toLocaleString('en-US')} CAKE</p>
                      </div>
                      <div className='border-[1px] rounded-full border-gray-200'></div>
                      <div className='flex justify-end mt-3 gap-3'>
                        <button className='bg-primary text-white px-5 py-2 rounded-lg duration-150 hover:scale-95' onClick={() => setIsOpen(!isOpen)}>
                          დახურვა
                        </button>
                        <button className='bg-primary text-white px-5 py-2 rounded-lg duration-150 hover:scale-95' onClick={() => withdrawFromPool()}>
                          გამოტანა
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default DepositButton
