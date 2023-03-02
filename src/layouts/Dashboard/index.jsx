import { useWeb3React } from '@web3-react/core'
import BitcoinIndex from 'components/BitcoinFearGreed'
import ChainBalancesCard from 'components/Cards/ChainBalancesCard'
import MiniCard from 'components/Cards/MiniCard'
import TokenBalancesCard from 'components/Cards/TokenBalancesCard'
import TransactionsCard from 'components/Cards/TransactionsCard'
import TrendingCoinsCard from 'components/Cards/TrendingCoinsCard'
import { useEffect, useRef, useState } from 'react'
import { FaImages } from 'react-icons/fa'
import { GiToken } from 'react-icons/gi'
import { MdAccountBalanceWallet } from 'react-icons/md'
import { SiBitcoinsv } from 'react-icons/si'
import { getCGTrending, getCMCTrending } from 'utils/APIs/CryptoLuxAPI'
import { getCoinPriceID, getMostSearched } from 'utils/APIs/CryptoRankAPI'
import { getNativeTransactions, getNftBalances, getTokenBalances } from 'utils/APIs/MoralisAPI'
import { getBalancesOnSupportedChains, getChainDataById, getNativeBalance } from 'utils/WalletHelpers'

const Index = () => {
  const mountedRef = useRef(true)
  const [isLoading, setIsLoading] = useState(Boolean)
  const { account, active, chainId } = useWeb3React()
  const [nativeBalances, setNativeBalances] = useState([])
  const [btcPrice, setBtcPrice] = useState(0)
  const [userNativeBalance, setUserNativeBalance] = useState()
  const [userTokens, setUserTokens] = useState([])
  const [userNFTs, setUserNFTs] = useState(0)
  const [userTXs, setUserTXs] = useState([])
  const [cmcTrending, setCmcTrending] = useState([])
  const [crTrending, setCrTrending] = useState([])
  const [cgTrending, setCgTrending] = useState([])
  const [isFetching, setIsFetching] = useState(Boolean)
  const userData = async () => {
    setIsLoading(true)
    const bal = await getBalancesOnSupportedChains(account)
    setNativeBalances(bal)

    const balance = await getNativeBalance(account)
    setUserNativeBalance(balance)
    
    const tokens = await getTokenBalances(account, getChainDataById(chainId).moralisId)
    setUserTokens(tokens)

    const nfts = await getNftBalances(account, getChainDataById(chainId).moralisId)
    setUserNFTs(nfts)

    const txs = await getNativeTransactions(account, getChainDataById(chainId).moralisId)
    setUserTXs(txs)
    setIsLoading(false)
  }

  const fetchMarketData = async () => {
    setIsFetching(true)

    const trendingCMC = await getCMCTrending()
    setCmcTrending(trendingCMC)

    const trendingCR = await getMostSearched()
    setCrTrending(trendingCR)

    const trendingCG = await getCGTrending()
    setCgTrending(trendingCG)

    setIsFetching(false)
  }

  const fetchData = async () => {
    const btc = await getCoinPriceID('bitcoin')
    if (typeof btc !== 'number') {
      setBtcPrice(0)
    } else {
      setBtcPrice(btc)
    }
  }

  useEffect(() => {
    fetchMarketData()
    fetchData()
    if (active) {
      userData()
    }
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [active])

  return (
    <div>
      {active && (
        <div>
          <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
            <MiniCard title='ბალანსი' data={`${Number(userNativeBalance).toFixed(4)}`} icon={<MdAccountBalanceWallet className='text-white text-3xl' />} isLoading={isLoading} />
            <MiniCard title='ტოკენები' data={userTokens.status === 200 ? (userTokens.data.length > 0 ? userTokens.data.length : '0') : '!'} icon={<GiToken className='text-white text-3xl' />} isLoading={isLoading} />
            <MiniCard title='NFT' data={userNFTs.status === 200 ? (userNFTs.data.result.length > 0 ? userNFTs.data.result.length : '0') : '!'} icon={<FaImages className='text-white text-2xl' />} isLoading={isLoading} />
            <MiniCard title='ბიტკოინის ფასი' data={`$${btcPrice.toLocaleString('en-US')}`} icon={<SiBitcoinsv className='text-white text-2xl' />} isLoading={isLoading} />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 w-full mt-2'>
            <ChainBalancesCard data={nativeBalances} isLoading={isLoading} />
            <TokenBalancesCard data={userTokens} isLoading={isLoading} />
            <TransactionsCard data={userTXs} isLoading={isLoading} />
          </div>
        </div>
      )}
      <div className={`${active ? 'mt-2' : ''}`}>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
          <BitcoinIndex />
          <TrendingCoinsCard title='ტრენდული ქოინები CoinMarketCap-ზე 🚀' data={cmcTrending} isFetching={isFetching} />
          <TrendingCoinsCard title='ტრენდული ქოინები CryptoRank-ზე 🚀' data={crTrending} isFetching={isFetching} />
          <TrendingCoinsCard title='ტრენდული ქოინები CoinGecko-ზე 🚀' data={cgTrending} isFetching={isFetching} />
        </div>
      </div>
    </div>
  )
}
export default Index
