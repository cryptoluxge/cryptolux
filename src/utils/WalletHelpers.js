import Web3 from 'web3'
import ARBITRUM from '../assets/images/Blockchains/Arbitrum.svg'
import AVAX from '../assets/images/Blockchains/Avalanche.svg'
import BSC from '../assets/images/Blockchains/Binance.svg'
import CRONOS from '../assets/images/Blockchains/Cronos.svg'
import ETH from '../assets/images/Blockchains/Ethereum.svg'
import FANTOM from '../assets/images/Blockchains/Fantom.svg'
import MATIC from '../assets/images/Blockchains/Matic.svg'
import Avatar from '../components/Avatar'
import { getCoinPriceID } from './APIs/CryptoRankAPI'

const web3 = new Web3(window.ethereum)

const web3BSC = new Web3('https://bsc-dataseed1.binance.org/')
const web3ETH = new Web3('https://rpc.ankr.com/eth')
const web3AVAX = new Web3('https://api.avax.network/ext/bc/C/rpc')
const web3MATIC = new Web3('https://polygon-rpc.com/')
const web3FTM = new Web3('https://rpc.ankr.com/fantom')
const web3CRO = new Web3('https://evm.cronos.org/')
const web3ARBI = new Web3('https://rpc.ankr.com/arbitrum')

export const checkWallet = () => {
  const result = {
    isMetamaskInstalled: false,
    isCoinbaseInstalled: false,
    isTrustWalletInstalled: false,
  }

  if (window.ethereum) {
    if (window.ethereum.isMetaMask) {
      result.isMetamaskInstalled = true
      result.isTrustWalletInstalled = true
    }
    if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.isCoinbaseWallet) {
      result.isCoinbaseInstalled = true
    }

    if (window.ethereum.isTrust) {
      result.isMetamaskInstalled = true
      result.isTrustWalletInstalled = true
    }
  }

  return result
}

export const getChainId = (chainName) => {
  // eslint-disable-next-line
  switch (chainName) {
    case 'ETH':
      return 1
    case 'BSC':
      return 56
    case 'AVAX':
      return 43114
    case 'FTM':
      return 250
    case 'MATIC':
      return 137
    case 'CRO':
      return 25
    case 'ARB':
      return 42161
    default:
      return 'Wrong Network'
  }
}

export const getChainFullName = (chainId) => {
  // eslint-disable-next-line
  const getChain = getChainDataById(chainId)
  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar src={getChain.logo} alt={getChain.symbol} className={getChain.logoWidth} />
      <div className='flex items-center'>
        <p className='text-sm hidden md:flex tracking-wide'>{getChain.name}</p>
        <p className='text-sm flex md:hidden tracking-wide'>{getChain.symbol}</p>
        <div id='pingingThing' className='flex items-center justify-center ml-2'>
          <div id='top1' className='animate-ping bg-green-400 w-2 h-2 rounded-full opacity-50 absolute z-[1]'></div>
          <div id='top2' className='bg-green-500 w-2 h-2 rounded-full relative z-0'></div>
        </div>
      </div>
    </div>
  )
}

export const shortAddress = (address, length) => {
  try {
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`
  } catch (error) {
    return '-'
  }
}

export const getNativeBalance = async (account) => {
  const nativeBalance = await web3.eth.getBalance(account)
  return web3.utils.fromWei(nativeBalance, 'ether')
}

export const getBalancesOnSupportedChains = async (account) => {
  const BNBPrice = await getCoinPriceID('bitcoin')
  const ETHPrice = await getCoinPriceID('ethereum')
  const AVAXPrice = await getCoinPriceID('avalanche')
  const maticPrice = await getCoinPriceID('matic-network')
  const ftmPrice = await getCoinPriceID('fantom')
  const croPrice = await getCoinPriceID('crypto-com-cro')
  const arbitrumPrice = await getCoinPriceID('ethereum')

  const balanceBSC = await web3BSC.eth.getBalance(account)
  const balanceETH = await web3ETH.eth.getBalance(account)
  const balanceAVAX = await web3AVAX.eth.getBalance(account)
  const balanceMATIC = await web3MATIC.eth.getBalance(account)
  const balanceFTM = await web3FTM.eth.getBalance(account)
  const balanceCRO = await web3CRO.eth.getBalance(account)
  const balanceARBI = await web3ARBI.eth.getBalance(account)

  return [
    { logoSize: 'w-4', logo: BSC, name: 'BSC', bal: web3BSC.utils.fromWei(balanceBSC, 'ether'), usd: Number(BNBPrice) * Number(web3BSC.utils.fromWei(balanceBSC, 'ether')) },
    { logoSize: 'w-3', logo: ETH, name: 'ETH', bal: web3ETH.utils.fromWei(balanceETH, 'ether'), usd: Number(ETHPrice) * Number(web3ETH.utils.fromWei(balanceETH, 'ether')) },
    { logoSize: 'w-4', logo: AVAX, name: 'AVAX', bal: web3AVAX.utils.fromWei(balanceAVAX, 'ether'), usd: Number(AVAXPrice) * Number(web3AVAX.utils.fromWei(balanceAVAX, 'ether')) },
    { logoSize: 'w-4', logo: MATIC, name: 'MATIC', bal: web3MATIC.utils.fromWei(balanceMATIC, 'ether'), usd: Number(maticPrice) * Number(web3AVAX.utils.fromWei(balanceMATIC, 'ether')) },
    { logoSize: 'w-3', logo: FANTOM, name: 'FTM', bal: web3AVAX.utils.fromWei(balanceFTM, 'ether'), usd: Number(ftmPrice) * Number(web3AVAX.utils.fromWei(balanceFTM, 'ether')) },
    { logoSize: 'w-4', logo: CRONOS, name: 'CRO', bal: web3AVAX.utils.fromWei(balanceCRO, 'ether'), usd: Number(croPrice) * Number(web3AVAX.utils.fromWei(balanceCRO, 'ether')) },
    { logoSize: 'w-4', logo: ARBITRUM, name: 'ETH', bal: web3AVAX.utils.fromWei(balanceARBI, 'ether'), usd: Number(arbitrumPrice) * Number(web3AVAX.utils.fromWei(balanceARBI, 'ether')) },
  ]
}

export const getChainDataById = (chainId) => {
  switch (chainId) {
    case 1:
      return { chainId: 1, name: 'Ethereum', symbol: 'ETH', coinName: 'Ethereum', coinSymbol: 'ETH', logo: ETH, logoWidth: 'w-3', moralisId: 'eth' }
    case 56:
      return { chainId: 56, name: 'Smart Chain', symbol: 'BSC', coinName: 'BNB', coinSymbol: 'BNB', logo: BSC, logoWidth: 'w-4', moralisId: 'bsc' }
    case 43114:
      return { chainId: 43114, name: 'Avalanche', symbol: 'AVAX', coinName: 'Avalanche', coinSymbol: 'AVAX', logo: AVAX, logoWidth: 'w-3', moralisId: 'avalanche' }
    case 250:
      return { chainId: 250, name: 'Fantom', symbol: 'FTM', coinName: 'Fantom', coinSymbol: 'FTM', logo: FANTOM, logoWidth: 'w-3', moralisId: 'polygon' }
    case 137:
      return { chainId: 137, name: 'Polygon', symbol: 'MATIC', coinName: 'Polygon', coinSymbol: 'MATIC', logo: MATIC, logoWidth: 'w-3', moralisId: 'fantom' }
    case 25:
      return { chainId: 25, name: 'Cronos', symbol: 'CRO', coinName: 'Cronos', coinSymbol: 'CRO', logo: CRONOS, logoWidth: 'w-3', moralisId: 'cronos' }
    case 42161:
      return { chainId: 42161, name: 'Arbitrum', symbol: 'ARBI', coinName: 'Ethereum', coinSymbol: 'ETH', logo: ARBITRUM, logoWidth: 'w-3', moralisId: 'arbitrum' }
    default:
      return { chainId: 0, name: '-', symbol: '-', coinName: '-', coinSymbol: '-', logo: '', logoWidth: '-', moralisId: '-' }
  }
}
