import BTCLogo from 'assets/images/Crypto/Bitcoin.svg'
import ETHLogo from 'assets/images/Crypto/Ethereum.svg'
import Avatar from 'components/Avatar'
import MiniCard from 'components/Cards/MiniCard'
import BitcoinIndex from 'components/BitcoinFearGreed'
import TrendingCoinsCard from 'components/Cards/TrendingCoinsCard'
import { useEffect, useRef, useState } from 'react'
import { AiFillDollarCircle } from 'react-icons/ai'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill, BsFillBarChartFill } from 'react-icons/bs'
import { getGlobalData } from 'utils/APIs/CoinGeckoAPI'
import { getCMCTrending, getCGTrending, getCGGainersLosers, getCMCGainersLosers } from 'utils/APIs/CryptoLuxAPI'
import { getMostSearched, getNewATH, getNewATL, getTopGainers, getTopLosers } from 'utils/APIs/CryptoRankAPI'

const Index = () => {
  const mountedRef = useRef(true)
  const [isCMCTabOpen, setIsCMCTabOpen] = useState(true)
  const [isCGTabOpen, setIsCGTabOpen] = useState(true)
  const [isCRTabOpen, setIsCRTabOpen] = useState(true)
  const [data, setData] = useState([])
  const [crTrending, setCrTrending] = useState([])
  const [cmcTrending, setCmcTrending] = useState([])
  const [cgTrending, setCgTrending] = useState([])
  const [cgGainers, setCgGainers] = useState([])
  const [cgLosers, setCgLosers] = useState([])
  const [cmcGainers, setCmcGainers] = useState([])
  const [cmcLosers, setCmcLosers] = useState([])
  const [gainers, setGainers] = useState([])
  const [losers, setLosers] = useState([])
  const [ath, setAths] = useState([])
  const [atl, setAtls] = useState([])
  const [isFetching, setIsFetching] = useState(Boolean)

  async function getMarketData() {
    setIsFetching(true)

    const global = await getGlobalData()
    setData(global.data.data)

    const getTrendingOnCR = await getMostSearched()
    setCrTrending(getTrendingOnCR)

    const trendingCMC = await getCMCTrending()
    setCmcTrending(trendingCMC)

    const trendingCG = await getCGTrending()
    setCgTrending(trendingCG)

    const getGainersLosersCG = await getCGGainersLosers()
    if (getGainersLosersCG.status === true) {
      setCgGainers({ data: getGainersLosersCG.data.gainers.slice(0, 10), status: true })
      setCgLosers({ data: getGainersLosersCG.data.losers.slice(0, 10), status: true })
    } else {
      setCgGainers({ data: [], status: false })
      setCgLosers({ data: [], status: false })
    }

    const getGainersLosersCMC = await getCMCGainersLosers()
    if (getGainersLosersCMC.status === true) {
      setCmcGainers({ data: getGainersLosersCMC.data.gainers_list.slice(0, 10), status: true })
      setCmcLosers({ data: getGainersLosersCMC.data.losers_list.slice(0, 10), status: true })
    } else {
      setCmcGainers({ data: [], status: true })
      setCmcLosers({ data: [], status: true })
    }

    const getGainers = await getTopGainers(10)
    setGainers(getGainers)

    const getLosers = await getTopLosers(10)
    setLosers(getLosers)

    const getaths = await getNewATH(10)
    setAths(getaths)

    const getatls = await getNewATL(10)
    setAtls(getatls)
    setIsFetching(false)
  }

  useEffect(() => {
    getMarketData()
    return () => {
      mountedRef.current = false
    }
  }, [])

  return (
    <div>
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
        {data.length === 0 ? null : <MiniCard title='კაპიტალიზაცია' data={`$${Number(data.total_market_cap.usd).toLocaleString('en-US')}`} className='' icon={<AiFillDollarCircle className='text-white text-3xl' />} />}
        {data.length === 0 ? null : <MiniCard title='ნავაჭრი (24სთ)' data={`$${Number(data.total_volume.usd).toLocaleString('en-US')}`} className='' icon={<BsFillBarChartFill className='text-white text-3xl' />} />}
        {data.length === 0 ? null : <MiniCard title='BTC დომინირება' data={`${Number(data.market_cap_percentage.btc).toFixed(2)}%`} className='' icon={<Avatar src={BTCLogo} alt='BTC' className='text-white w-5' />} />}
        {data.length === 0 ? null : <MiniCard title='ETH დომინირება' data={`${Number(data.market_cap_percentage.eth).toFixed(2)}%`} className='' icon={<Avatar src={ETHLogo} alt='ETH' className='text-white w-5' />} />}
      </div>
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full mt-2'>
        <BitcoinIndex />
        <TrendingCoinsCard title='ტრენდული ქოინები CoinMarketCap-ზე 🚀' data={cmcTrending} isFetching={isFetching} />
        <TrendingCoinsCard title='ტრენდული ქოინები CryptoRank-ზე 🚀' data={crTrending} isFetching={isFetching} />
        <TrendingCoinsCard title='ტრენდული ქოინები CoinGecko-ზე 🚀' data={cgTrending} isFetching={isFetching} />
      </div>
      <div className='mt-2'>
        <div>
          <div className='flex justify-between items-center'>
            <p className='text-lightText text-xl'>CoinMarketCap Data</p>
            {isCMCTabOpen ? (
              <BsFillArrowDownCircleFill onClick={() => setIsCMCTabOpen(!isCMCTabOpen)} className='text-primary text-2xl cursor-pointer' />
            ) : (
              <BsFillArrowUpCircleFill onClick={() => setIsCMCTabOpen(!isCMCTabOpen)} className='text-primary text-2xl cursor-pointer' />
            )}
          </div>
          <div className='border-[1px] border-primary w-full mb-3 mt-3'></div>
        </div>
        {isCMCTabOpen && (
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full mt-2'>
            <TrendingCoinsCard title='TOP GAINERS 🚀' data={cmcGainers} isFetching={isFetching} />
            <TrendingCoinsCard title='TOP LOSERS 🔻' data={cmcLosers} isFetching={isFetching} />
          </div>
        )}
      </div>
      <div className='mt-2'>
        <div>
          <div className='flex justify-between items-center'>
            <p className='text-lightText text-xl'>CoinGecko Data</p>
            {isCGTabOpen ? (
              <BsFillArrowDownCircleFill onClick={() => setIsCGTabOpen(!isCGTabOpen)} className='text-primary text-2xl cursor-pointer' />
            ) : (
              <BsFillArrowUpCircleFill onClick={() => setIsCGTabOpen(!isCGTabOpen)} className='text-primary text-2xl cursor-pointer' />
            )}
          </div>
          <div className='border-[1px] border-primary w-full mb-3 mt-3'></div>
        </div>
        {isCGTabOpen && (
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full mt-2'>
            <TrendingCoinsCard title='TOP GAINERS 🚀' data={cgGainers} isFetching={isFetching} />
            <TrendingCoinsCard title='TOP LOSERS 🔻' data={cgLosers} isFetching={isFetching} />
          </div>
        )}
      </div>
      <div className='mt-2'>
        <div>
          <div className='flex justify-between items-center'>
            <p className='text-lightText text-xl'>CryptoRank Data</p>
            {isCRTabOpen ? (
              <BsFillArrowDownCircleFill onClick={() => setIsCRTabOpen(!isCRTabOpen)} className='text-primary text-2xl cursor-pointer' />
            ) : (
              <BsFillArrowUpCircleFill onClick={() => setIsCRTabOpen(!isCRTabOpen)} className='text-primary text-2xl cursor-pointer' />
            )}
          </div>
          <div className='border-[1px] border-primary w-full mb-3 mt-3'></div>
        </div>
        {isCRTabOpen && (
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full mt-2'>
            <TrendingCoinsCard title='TOP GAINERS 🚀' data={gainers} isFetching={isFetching} />
            <TrendingCoinsCard title='TOP LOSERS 🔻' data={losers} isFetching={isFetching} />
            <TrendingCoinsCard title='NEW ATH 🚀' data={ath} isFetching={isFetching} />
            <TrendingCoinsCard title='NEW ATL 🔻' data={atl} isFetching={isFetching} />
          </div>
        )}
      </div>
    </div>
  )
}
export default Index
