import { useWallet } from '@aptos-labs/wallet-adapter-react'
import ConnectWalletButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import Wallet from './Wallet'

const Index = () => {
  const { connected } = useWallet()
  return (
    <div>
      {connected === true ? (
        <div>
          <Wallet />
        </div>
      ) : (
        <div>
          <div className='flex items-center justify-center'>
            <div className='bg-primary/50 border-[1px] border-primary rounded-lg p-2'>
              <p className='text-white text-sm w-full font-light'>საფულის დაკავშირების გარეშე ამ გვერდს ვერ გამოიყენებთ.</p>
              <div className='mt-2'>
                <ConnectWalletButton text='დააკავშირეთ საფულე' />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
