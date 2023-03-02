import IFOBGNotFound from 'assets/images/pcs/ifobg.png'
import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useCakePrice } from 'hooks/useDexTokenPrices'
import { useEffect, useState } from 'react'
import { getIfoTokenPrice } from 'utils/BNBChain/PancakeSwapHelpers/IfoHelpers'
import AutomaticIFO from './AutomaticIFO'
import PrivateSale from './SaleCard/PrivateSale'
import PublicSale from './SaleCard/PublicSale'
import Timer from './Timer'

const Index = () => {
  const [cakePrice, setCakePrice] = useState(0)
  const [tokenPrice, setTokenPrice] = useState()

  const GetCakePrice = async () => {
    const price = await useCakePrice()
    setCakePrice(price)
    const ifoTokenPrice = await getIfoTokenPrice(ifo[0].tokenDetails.address, ifo[0].tokenDetails.decimal)
    setTokenPrice(ifoTokenPrice)
  }

  useEffect(() => {
    setInterval(() => {
      GetCakePrice()
    }, 3000)
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <Card>
        <div>
          <Avatar src={ifo[0].ifoBanner == null ? IFOBGNotFound : ifo[0].ifoBanner} alt='' className='rounded-t-lg w-full' />
        </div>
        <Timer />
        <div className='mt-3 px-3 flex items-center gap-2 justify-center'>
          <div className='flex items-center gap-1'>
            <Avatar src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg' alt='CAKE' className='w-6' />
            <p className='text-lightText   text-sm'>ფასი: ${cakePrice.toLocaleString('en-US')}</p>
          </div>
          <div className='flex items-center gap-1'>
            <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='CAKE' className='w-6 rounded-full' />
            <div>
              {tokenPrice > 0 ? (
                <div className='flex items-center gap-1'>
                  <p className='text-lightText  text-sm'>ფასი: ${Number(tokenPrice).toLocaleString('en-US')}</p>
                  <p className='text-lightText  text-sm'>({`${(Number(tokenPrice) / Number(ifo[0].tokenOfferingPrice)).toFixed(2)}X`})</p>
                </div>
              ) : (
                <p className='text-lightText  text-sm'>ფასი: $0.00</p>
              )}
            </div>
          </div>
        </div>
        <div className='grid grid-row-2 md:grid-cols-2 gap-5 p-3'>
          <PublicSale />
          <PrivateSale />
        </div>
        <AutomaticIFO />
      </Card>
    </div>
  )
}

export default Index
