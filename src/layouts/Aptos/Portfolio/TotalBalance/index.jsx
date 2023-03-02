import Card from 'components/Cards/Card'
import LoadingPulse from 'components/Skelaton'
import Typography from 'components/Typography'
import { useEffect, useState } from 'react'
import { BiDollar } from 'react-icons/bi'
import { convertAptToUSD, getTokensPrice } from 'utils/APIs/CoinGeckoAPI'
import { getNFTsUsdValue } from 'utils/APIs/TopazAPI'
import { getUserStakedAptoadsUSD } from 'utils/Helpers/AptosHelpers/EcosystemProjects/Aptoads'
import { getUserStakedMonkeysUSD } from 'utils/Helpers/AptosHelpers/EcosystemProjects/AptosMonkeys'
import { getUserStakedBearsUSD } from 'utils/Helpers/AptosHelpers/EcosystemProjects/BruhTavern'
import { getUserStakedMavrikUSD } from 'utils/Helpers/AptosHelpers/EcosystemProjects/Mavrik'

const Index = ({ aptBalance, nftBalances, tokensBalance, stakedAptoads, stakedMonkeys, stakedMavriks, stakedBruhs }) => {
  const [isLoading, setIsLoading] = useState(Boolean)
  const [totalUsd, setTotalUsd] = useState(0)

  const getPrices = async () => {
    setIsLoading(true)
    const aptUSD = await convertAptToUSD(aptBalance)
    const nftsUSD = await getNFTsUsdValue(nftBalances)
    const tokensUSD = await getTokensPrice(tokensBalance)

    const getStakedToadsUSD = await getUserStakedAptoadsUSD(stakedAptoads)
    const getStakedMonkeysUSD = await getUserStakedMonkeysUSD(stakedMonkeys)
    const getStakedBearsUSD = await getUserStakedBearsUSD(stakedBruhs)
    const getStakedMavrikUSD = await getUserStakedMavrikUSD(stakedMavriks)
    const usdValue = nftsUSD + tokensUSD + aptUSD + getStakedToadsUSD + getStakedMonkeysUSD + getStakedBearsUSD + getStakedMavrikUSD
    setTotalUsd(usdValue)

    setIsLoading(false)
  }

  useEffect(() => {
    getPrices()
    // eslint-disable-next-line
  }, [nftBalances, tokensBalance, stakedAptoads, stakedMonkeys, stakedMavriks, stakedBruhs])

  return (
    <div>
      <Card className='p-2'>
        <div className='flex items-center justify-between'>
          <div>
            <Typography>ბალანსი სულ</Typography>
            {isLoading === false && isNaN(totalUsd) === false ? (
              <div>
                <Typography className='text-md'>${totalUsd.toLocaleString('en-US')}</Typography>
              </div>
            ) : (
              <div>
                <LoadingPulse width='full' />
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-md bg-primary flex justify-center items-center`}><BiDollar className='text-white text-2xl font-bold' /></div>
        </div>
      </Card>
    </div>
  )
}

export default Index
