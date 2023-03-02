import { Dialog, Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import Button from 'components/Button'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useToast } from 'hooks/useToast'
import { Fragment, useEffect, useRef, useState } from 'react'
import { getIfoCakePoolContract, getIfoPoolContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import { getUserCakeBalance, getVaultUserData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
import Web3 from 'web3'

const DepositCAKE = ({ poolType }) => {
  const mountedRef = useRef(true)
  const cancelButtonRef = useRef(null)
  const { account, active, chainId } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const [limitPerUserCAKE, setLimitPerUserCAKE] = useState('')
  const [userBalance, setUserBalance] = useState(0)
  const toast = useToast()
  const web3 = new Web3(window.ethereum)
  const offeringTokenIFOPoolContract = getIfoPoolContract(ifo[0].poolContract, chainId)
  const IFOPoolContract = getIfoCakePoolContract(chainId)

  const getMaximumCake = async () => {
    if (poolType === 'private') {
      const getMAXCake = await getVaultUserData(account)
      setLimitPerUserCAKE(getMAXCake.depositedCake)
      const cakeBalance = await getUserCakeBalance(account)
      setUserBalance(cakeBalance)
    } else {
      const userCredit = await IFOPoolContract.methods.getUserCredit(account).call()
      setLimitPerUserCAKE(web3.utils.fromWei(userCredit, 'ether'))
    }
  }

  const setMAXcake = () => {
    if (Number(limitPerUserCAKE) <= Number(userBalance)) {
      document.getElementById('cakeToDeposit').value = userBalance
    } else if (Number(limitPerUserCAKE) >= Number(userBalance)) {
      document.getElementById('cakeToDeposit').value = limitPerUserCAKE
    }
  }

  const depositInPool = async () => {
    const cakeInEther = document.getElementById('cakeToDeposit').value
    const cakeInWei = web3.utils.toWei(cakeInEther, 'ether')
    if (poolType === 'private') {
      await offeringTokenIFOPoolContract.methods
        .depositPool(cakeInWei, 0)
        .send({ from: account, gasLimit: ifo[0].gasLimits.deposit })
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
            toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `თქვენი შეიტანეთ ${Number(cakeInEther).toLocaleString('en-US')} CAKE-ი Private Pool-ში`, receipt.transactionHash)
          } else {
            toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა', '', receipt.transactionHash)
          }
        })
    } else {
      await offeringTokenIFOPoolContract.methods
        .depositPool(cakeInWei, 1)
        .send({ from: account, gasLimit: ifo[0].gasLimits.deposit })
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
            toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `თქვენი შეიტანეთ ${Number(cakeInEther).toLocaleString('en-US')} CAKE-ი Public Pool-ში`, receipt.transactionHash)
          } else {
            toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა', '', receipt.transactionHash)
          }
        })
    }
  }

  useEffect(() => {
    if (active === true && account.length > 0) {
      getMaximumCake()
    }
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [account, active])

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>შეტანა</Button>
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
                <Dialog.Panel className='relative rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:max-w-lg sm:w-full'>
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
                      <h3 className='text-lightText '>{poolType === 'public' ? 'Public' : 'Private'} Sale - შეტანა</h3>
                    </div>
                    <div className='p-3'>
                      <div>
                        <label className='block mb-2 text-sm font-medium text-lightText'>რაოდენობა</label>
                        <div className='flex items-center gap-2'>
                          <input type='text' id='cakeToDeposit' className='rounded-lg block w-full p-2.5 bg-gray-200    text-lightText ' placeholder='რაოდენობა' required />
                          <div onClick={() => setMAXcake()} className='bg-primary p-2 rounded-lg text-white duration-150 hover:bg-dark cursor-pointer'>
                            MAX
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-between items-center mt-4'>
                        <p className='block mb-2 text-sm font-medium text-lightText'>მაქსიმუმ შეგიძლიათ შეიტანოთ:</p>
                        <p className='block mb-2 text-sm font-medium text-lightText'>{Number(limitPerUserCAKE).toLocaleString('en-US')} CAKE</p>
                      </div>
                      <div className='flex justify-between items-center'>
                        <p className='block mb-2 text-sm font-medium text-lightText'>ბალანსზე გაქვთ:</p>
                        <p className='block mb-2 text-sm font-medium text-lightText'>{Number(userBalance).toLocaleString('en-US')} CAKE</p>
                      </div>
                      <div className='border-[1px] rounded-full border-gray-200'></div>
                      <div className='flex justify-end mt-3 gap-3'>
                        <Button onClick={() => setIsOpen(!isOpen)}>დახურვა</Button>
                        <Button onClick={() => depositInPool()}>შეტანა</Button>
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

export default DepositCAKE
