import { AiFillWarning } from 'react-icons/ai'
import { AvalancheChain, BNBChain, ETHChain, FantomChain, PolygonChain, CronosChain, ArbitrumChain } from 'utils/EVMNetworks'

const WrongNetwork = ({ changeTo, text }) => {
  const changeNetwork = (changeTo) => {
    // eslint-disable-next-line
    switch (changeTo) {
      case 'BSC':
        BNBChain()
        break
      case 'ETH':
        ETHChain()
        break
      case 'AVAX':
        AvalancheChain()
        break
      case 'FANTOM':
        FantomChain()
        break
      case 'MATIC':
        PolygonChain()
        break
      case 'CRONOS':
        CronosChain()
        break
      case 'ARBITRUM':
        ArbitrumChain()
        break
    }
  }

  return (
    <div>
      <button onClick={() => changeNetwork(changeTo)} className='flex justify-center w-full bg-red-600 text-white text-sm  p-2 rounded-lg gap-1 duration-150 hover:scale-95'>
        <AiFillWarning className='text-lg' />
        {text}
      </button>
    </div>
  )
}

export default WrongNetwork
