import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import { useToast } from 'hooks/useToast'
import { useEffect, useRef } from 'react'
import ConnectButton from './ConnectButton'
import { injected } from './connectors'
import DisconnectButton from './DisconnectButton'
import WrongNetwork from './WrongNetwork'
import { supportedEvmChainsIDs } from 'config'

export default function Modal() {
  const mountedRef = useRef(true)
  const { active, activate, chainId } = useWeb3React()
  const { connect, connected } = useWallet()
  const toast = useToast()
  const provider = window.ethereum
  const isConnected = localStorage.getItem('isEVMWalletConnected')
  const isEVMConnected = localStorage.getItem('isMoveWalletConnected')

  const connectEvmWalletOnPageLoad = async () => {
    if (localStorage?.getItem('isEVMWalletConnected') === 'true') {
      try {
        if (typeof provider !== 'undefined') {
          await activate(injected)
          localStorage.setItem('isEVMWalletConnected', true)
        } else {
          toast('error', 'საფულის დასაკავშირებლად საჭიროა Metamask!')
        }
      } catch (ex) {
        toast('error', 'დაფიქსირდა შეცდომა!', ex)
      }
    }
  }

  const connectAptosWalletOnPageLoad = () => {
    if (connected === false && isEVMConnected === 'true') {
      try {
        const connectedWallet = localStorage.getItem('AptosWalletName')
        connect(connectedWallet)
      } catch (ex) {
        toast('error', '', ex)
      }
    }
  }

  useEffect(() => {
    connectEvmWalletOnPageLoad()
    connectAptosWalletOnPageLoad()

    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [active, connected])

  return (
    <div className='p-3 flex items-center'>
      {active && (isConnected === 'true' || connected) ? <div>{supportedEvmChainsIDs.includes(chainId) || connected ? <DisconnectButton /> : <WrongNetwork changeTo='BSC' text='არასწორი ქსელი' />}</div> : <ConnectButton />}
    </div>
  )
}
