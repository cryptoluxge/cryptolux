import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useWeb3React } from '@web3-react/core'
import MetamaskIcon from 'assets/images/WalletIcons/MetamaskIcon.svg'
import TrustWalletIcon from 'assets/images/WalletIcons/TrustWalletIcon.svg'
import Avatar from 'components/Avatar'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { Fragment } from 'react'
import { BiWallet } from 'react-icons/bi'
import { FiCopy, FiExternalLink } from 'react-icons/fi'
import { IoIosLogOut } from 'react-icons/io'
import { getChainFullName, shortAddress } from 'utils/WalletHelpers'
import { getExplorerURL } from 'utils/getExplorerURL'
import ChainSelector from '../../ChainSelector'
import ConnectWallet from './ConnectButton'

export default function DisconnectButton() {
  const { account: web3Account, deactivate, chainId, active } = useWeb3React()
  const { account: aptosAccount, disconnect, connected, wallet } = useWallet()
  const toast = useToast()
  const evmWallet = localStorage.getItem('connectedEVMWallet')
  const isEVMWallet = localStorage.getItem('isEVMWalletConnected')

  const evmWalletDisconnect = async () => {
    try {
      deactivate()
      localStorage.setItem('isEVMWalletConnected', false)
    } catch (ex) {
      toast('error', 'დაფიქსირდა შეცდომა!', ex)
    }
  }

  const moveWalletDisconnect = async () => {
    try {
      disconnect()
      localStorage.setItem('isMoveWalletConnected', false)
    } catch (ex) {
      toast('error', 'დაფიქსირდა შეცდომა!', ex)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <ChainSelector />
      <Menu as='div' className='inline-block text-left'>
        <Menu.Button className='p-2 w-full rounded-md bg-lightCard font-medium text-white duration-150 border-[1px] border-lightBorder'>
          <div className='flex items-center justify-between gap-3'>
            <BiWallet />
            <Typography>საფულე</Typography>
            <ChevronDownIcon className='h-5 w-5' aria-hidden='true' />
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'>
          <Menu.Items className='origin-top-center absolute center-1 mt-2 w-auto rounded-md shadow-lg z-50 bg-lightModal focus:outline-none border-[1px] border-lightBorder right-3'>
            <div>
              {active && (
                <div className=''>
                  <div className='p-2'>
                    <Typography className='text-sm mb-1' color='text-gray-500'>
                      EVM ქსელი
                    </Typography>
                    <div className='flex items-center text-lightText'>{active ? getChainFullName(chainId) : 'Mainnet'}</div>
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div>
                    <div className='px-3 py-3 flex items-center gap-2 cursor-pointer'>
                      <Avatar src={evmWallet === 'Metamask' ? MetamaskIcon : TrustWalletIcon} className='w-4' />
                      <Typography className='text-sm whitespace-nowrap'>{shortAddress(web3Account, 5)}</Typography>
                    </div>
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div onClick={() => navigator.clipboard.writeText(web3Account)} className='p-3 flex items-center gap-2 cursor-pointer duration-200 hover:bg-lightHover'>
                    <FiCopy className='text-lightText flex-nowrap' />
                    <Typography className='text-sm whitespace-nowrap'>მისამართის კოპირება</Typography>
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div className='p-3 flex items-center gap-2 cursor-pointer duration-200 hover:bg-lightHover'>
                    <FiExternalLink className='text-lightText flex-nowrap' />
                    <a href={getExplorerURL('evm', chainId, 'wallet', web3Account)} target='_blank' rel='noreferrer' className='flex items-center gap-1 duration-150 cursor-pointer text-sm'>
                      <Typography className='text-sm whitespace-nowrap'>ნახე Explorer-ზე</Typography>
                    </a>
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div onClick={() => evmWalletDisconnect()} className='p-3 flex items-center gap-2 cursor-pointer duration-200 hover:bg-lightHover rounded-b-lg'>
                    <IoIosLogOut className='text-lightText flex-nowrap text-lg' />
                    <Typography className='text-sm whitespace-nowrap'>გამოსვლა</Typography>
                  </div>
                </div>
              )}
              {connected === true && (
                <div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div className='p-2'>
                    <Typography className='text-sm mb-1' color='text-gray-500'>
                      APTOS ქსელი
                    </Typography>
                    <div className='flex items-center'>
                      <Typography>Mainnet</Typography>
                      <div id='pingingThing' className='flex items-center justify-center ml-2'>
                        <div id='top1' className='animate-ping bg-green-400 w-2 h-2 rounded-full opacity-50 absolute z-[1]'></div>
                        <div id='top2' className='bg-green-500 w-2 h-2 rounded-full relative z-0'></div>
                      </div>
                    </div>
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div className=''>
                    <div>
                      <div className='px-3 py-3 flex items-center gap-2 cursor-pointer'>
                        <Avatar src={wallet.icon} className='w-5' />
                        <Typography className='text-sm whitespace-nowrap'>{shortAddress(aptosAccount.address, 5)}</Typography>
                      </div>
                    </div>
                    <div className='border-[1px] border-lightBorder'></div>
                    <div onClick={() => navigator.clipboard.writeText(aptosAccount.address)} className='p-3 flex items-center gap-2 cursor-pointer duration-200 hover:bg-lightHover'>
                      <FiCopy className='text-lightText flex-nowrap' />
                      <Typography className='text-sm whitespace-nowrap'>მისამართის კოპირება</Typography>
                    </div>
                    <div className='border-[1px] border-lightBorder'></div>
                    <div className='p-3 flex items-center gap-2 cursor-pointer duration-200 hover:bg-lightHover'>
                      <FiExternalLink className='text-lightText flex-nowrap' />
                      <a href={getExplorerURL('APT', 0, 'wallet', aptosAccount.address)} target='_blank' rel='noreferrer' className='flex items-center gap-1 duration-150 cursor-pointer text-sm'>
                        <Typography className='text-sm whitespace-nowrap'>ნახე Explorer-ზე</Typography>
                      </a>
                    </div>
                    <div className='border-[1px] border-lightBorder'></div>
                    <div onClick={() => moveWalletDisconnect()} className='p-3 flex items-center gap-2 cursor-pointer duration-200 hover:bg-lightHover rounded-b-lg'>
                      <IoIosLogOut className='text-lightText flex-nowrap text-lg' />
                      <Typography className='text-sm whitespace-nowrap'>გამოსვლა</Typography>
                    </div>
                  </div>
                </div>
              )}
              {isEVMWallet && !connected && (
                <div className='p-1'>
                  <ConnectWallet text='დაამატე APTOS საფულე' />
                </div>
              )}
              {connected && !active && (
                <div className='p-1'>
                  <ConnectWallet text='დაამატე EVM საფულე' />
                </div>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
