import IFOCard from 'components/PancakeSwap/IFO/IFOCard'
import IFOPool from 'components/PancakeSwap/IFO/IFOPool'
import IFOTokenDescription from 'components/PancakeSwap/IFO/IFOTokenDescription'
import LiquidityPool from 'components/PancakeSwap/IFO/LiquidityPool'
import PrivateSaleInfo from 'components/PancakeSwap/IFO/PrivateSaleInfo'
import SyrupPool from 'components/PancakeSwap/IFO/SyrupPool'
import TotalUsers from 'components/PancakeSwap/IFO/TotalUsers'

const index = () => {
  return (
    <div>
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full ჰ-ა'>
        <div>
          <IFOPool />
          <IFOTokenDescription />
        </div>
        <div className='md:col-span-2'>
          <IFOCard />
          <TotalUsers />
        </div>
        <div>
          <PrivateSaleInfo />
          <LiquidityPool />
          <SyrupPool />
        </div>
      </div>
    </div>
  )
}

export default index
