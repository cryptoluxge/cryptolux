import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import MetamaskIcon from 'assets/images/WalletIcons/MetamaskIcon.svg'
import TrustWalletIcon from 'assets/images/WalletIcons/TrustWalletIcon.svg'
import Modal from 'components/Modal'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { injected } from './connectors'
import WalletItem from './WalletItem'
import { checkWallet } from 'utils/WalletHelpers'

export default function ConnectWallet({ text }) {
  const { activate } = useWeb3React()
  const { connect, wallets } = useWallet()
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const provider = window.ethereum

  const getWallets = checkWallet()

  const connectEvmWallet = async (wallet, isWalletInstalled) => {
    if (isWalletInstalled) {
      try {
        if (typeof provider !== 'undefined') {
          await activate(injected)
          localStorage.setItem('isEVMWalletConnected', true)
          localStorage.setItem('isEVMWalletConnected', true)
          localStorage.setItem('connectedEVMWallet', wallet)
        } else {
          toast('error', `საფულის დასაკავშირებლად საჭიროა ${wallet} საფულე!`)
        }
      } catch (ex) {
        toast('error', 'დაფიქსირდა შეცდომა!', ex)
      }
    } else {
      toast('error', `საფულის დასაკავშირებლად საჭიროა ${wallet} საფულე!`)
    }
  }

  const connectMoveWallet = async (wallet, isDetected) => {
    if (isDetected === 'Installed') {
      try {
        connect(wallet)
        localStorage.setItem('isMoveWalletConnected', true)
      } catch (ex) {
        toast('error', 'დაფიქსირდა შეცდომა!', ex)
      }
    } else {
      toast('error', 'საფულის დასაკავშირებლად საჭიროა APTOS-ის საფულე!')
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setOpen(true)} type='button' className='duration-150 text-white w-full bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium px-3 py-2.5 flex justify-center'>
          <svg className='mr-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'></path>
          </svg>
          {text ? text : 'შესვლა'}
        </button>
      </div>
      <Modal title='საფულის დაკავშირება' open={open} close={() => setOpen(!open)}>
        <div className='px-3'>
          <p className='text-sm text-gray-500'>დაუკავშირდით თქვენი საფულით ან შექმენით ახალი.</p>
          <ul className='my-4 space-y-3'>
            <Typography className='text-sm'>EVM ქსელებისთვის</Typography>
            <div className='border-[1px] border-lightBorder'></div>
            <div onClick={() => connectEvmWallet('Metamask', getWallets.isMetamaskInstalled)}>
              <WalletItem name='Metamask' icon={MetamaskIcon} isInstalled={getWallets.isMetamaskInstalled} />
            </div>
            <div onClick={() => connectEvmWallet('Trust Wallet', getWallets.isTrustWalletInstalled)}>
              <WalletItem name='Trust Wallet' icon={TrustWalletIcon} isInstalled={getWallets.isTrustWalletInstalled} />
            </div>
            <Typography className='text-sm'>APTOS ქსელისთვის</Typography>
            <div className='border-[1px] border-lightBorder'></div>
            {wallets.map((wallet) => (
              <div key={wallet.name} onClick={() => connectMoveWallet(wallet.name, wallet.readyState)}>
                <WalletItem name={wallet.name} icon={wallet.icon} isInstalled={wallet.readyState === "NotDetected" ? false : true} />
              </div>
            ))}

          </ul>
          <div>
            <a href='#/' className='inline-flex items-center text-xs  text-gray-500 hover:underline'>
              <svg className='mr-2 w-3 h-3' aria-hidden='true' focusable='false' data-prefix='far' data-icon='question-circle' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                <path
                  fill='currentColor'
                  d='M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z'></path>
              </svg>
              რატომ მჭირდება საფულის დაკავშირება?
            </a>
          </div>
        </div>
      </Modal>
    </div>
  )
}
