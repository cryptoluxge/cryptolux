import { Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'
import Skelaton from 'components/Skelaton'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useCakePrice } from 'hooks/useDexTokenPrices'
import { useEffect, useRef, useState } from 'react'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { getIfoPoolContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import Web3 from 'web3'
import getSquadUsers from './getSquadUsers'

const Index = () => {
  const mountedRef = useRef(true)
  const { chainId } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const squadUsers = getSquadUsers()
  const [maxLP, setMaxLP] = useState()
  const [cakePrice, setCakePrice] = useState()

  const GetCakePrice = async () => {
    const price = await useCakePrice()
    setCakePrice(price)
  }

  const getMaximumCAKE = async () => {
    const web3 = new Web3('https://bsc-dataseed.binance.org')
    const OfferingIFOContract = getIfoPoolContract(ifo[0].poolContract, chainId)
    const getMax = await OfferingIFOContract.methods.viewPoolInformation(0).call()
    setMaxLP(web3.utils.fromWei(getMax[2], 'ether'))
  }

  const maXLPinUSD = maxLP * cakePrice

  //  თუ ყველამ მიიღო მონაწილეობა მაშინ აგროვდება
  const ifAllUserParticipatedRaised = Number(squadUsers) * Number(maXLPinUSD)
  //  ტოკენების გადანაწილება
  const eachTokensForAllUsers = ifo[0].privatePool.saleAmount / Number(squadUsers)
  //  ტოკენების ფასი
  const eachTokensForAllUsersPrice = eachTokensForAllUsers * ifo[0].tokenOfferingPrice
  // Overflow-ს გამოთვლა
  const overflowIfAllUserParticipatd = (ifAllUserParticipatedRaised / ifo[0].privatePool.raiseAmount) * 100
  // დასაბრუნებელი ქეიქი
  const eachTokensPrice = eachTokensForAllUsers * ifo[0].tokenOfferingPrice
  const cakeToReturn = (maXLPinUSD - eachTokensPrice) / cakePrice
  const cakeToReturnPrice = cakeToReturn * cakePrice

  useEffect(() => {
    GetCakePrice()

    if (ifo[0].poolContract !== null) {
      getMaximumCAKE()
    }

    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Card>
      <div className='p-2 text-white bg-primary rounded-lg md:rounded-t-lg flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex md:hidden'>
            <Avatar src='https://pancakeswap.finance/images/ifos/vesting/not-tokens.svg' alt='Info' className='w-12 rounded-full' />
          </div>
          <div>
            <p>Private Sale</p>
            <p>წინასწარი ინფორმაცია</p>
          </div>
        </div>
        <div className='hidden md:flex'>
          <div className='border-2 rounded-full'>
            <Avatar src='https://pancakeswap.finance/images/ifos/vesting/not-tokens.svg' alt='Info' className='w-12 rounded-full' />
          </div>
        </div>
        <div className='flex md:hidden' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <BsFillArrowUpCircleFill className='text-3xl cursor-pointer' /> : <BsFillArrowDownCircleFill className='text-3xl cursor-pointer' />}
        </div>
      </div>
      <div className='hidden md:flex'>
        <div className='p-3 space-y-5'>
          {ifo[0].isCIFO ? (
            <div>
              <Alert variant='info' text='cIFO-ში ეს ინფორმაცია არ გამოდგება.' />
            </div>
          ) : null}
          <div className='text-lightText text-sm'>
            <p>აგროვდება</p>
            {Number(ifAllUserParticipatedRaised) >= 0 ? <p className=''>{Number(ifAllUserParticipatedRaised) > 0 ? `$${ifAllUserParticipatedRaised.toLocaleString('en-US')}` : 0}</p> : <Skelaton />}
          </div>
          <div className='text-lightText text-sm'>
            <p>თითოს შეხვდება</p>
            {Number(eachTokensForAllUsers) >= 0 ? <p className=''>{Number(eachTokensForAllUsers) > 0 ? ` ~${eachTokensForAllUsers.toLocaleString('en-US')} ${ifo[0].tokenDetails.symbol}` : `0.00 ${ifo[0].tokenDetails.symbol}`}</p> : <Skelaton />}
          </div>
          <div className='text-lightText text-sm'>
            <p>Overflow იქნება</p>
            {Number(overflowIfAllUserParticipatd) >= 0 ? <p className=''>{Number(overflowIfAllUserParticipatd) > 1 ? ` ~${overflowIfAllUserParticipatd.toLocaleString('en-US')}%` : `0.00%`}</p> : <Skelaton />}
          </div>
          <div className='text-lightText text-sm'>
            <p>დაგიბრუნდებათ</p>
            <p className=''>{Number(cakeToReturn) > 0 ? `~${cakeToReturn.toLocaleString('en-US')} CAKE (~$${cakeToReturnPrice.toLocaleString('en-US')})` : `0.00 CAKE`}</p>
          </div>
          <div className='text-lightText text-sm'>
            <p>იუზერები Squad-ით</p>
            {Number(squadUsers) >= 0 ? <p className=''>{Number(squadUsers) > 0 ? squadUsers : 0}</p> : <Skelaton />}
          </div>
        </div>
      </div>
      <Transition
        show={isOpen}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 translate-y-0'
        enterTo='transform opacity-100 translate-y-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 translate-y-100'
        leaveTo='transform opacity-0 translate-y-0'>
        <div>
          <div className='p-3 space-y-5'>
            <div className='text-lightText text-sm'>
              <p>აგროვდება</p>
              {Number(ifAllUserParticipatedRaised) >= 0 ? <p className=''>{Number(ifAllUserParticipatedRaised) > 0 ? `$${ifAllUserParticipatedRaised.toLocaleString('en-US')}` : 0}</p> : <Skelaton />}
            </div>
            <div className='text-lightText text-sm'>
              <p>თითოს შეხვდება</p>
              {Number(eachTokensForAllUsers) >= 0 ? (
                <p className=''>
                  {Number(eachTokensForAllUsers) > 0 ? ` ~${eachTokensForAllUsers.toLocaleString('en-US')} ${ifo[0].tokenDetails.symbol} ($${eachTokensForAllUsersPrice.toLocaleString('en-US')})` : `0.00 ${ifo[0].tokenDetails.symbol}`}
                </p>
              ) : (
                <Skelaton />
              )}
            </div>
            <div className='text-lightText text-sm'>
              <p>Overflow იქნება</p>
              {Number(overflowIfAllUserParticipatd) >= 0 ? <p className=''>{Number(overflowIfAllUserParticipatd) > 1 ? ` ~${overflowIfAllUserParticipatd.toLocaleString('en-US')}%` : `0.00%`}</p> : <Skelaton />}
            </div>
            <div className='text-lightText text-sm'>
              <p>დაგიბრუნდებათ</p>
              <p className=''>{Number(cakeToReturn) > 0 ? `~${cakeToReturn.toLocaleString('en-US')} CAKE (~${cakeToReturnPrice.toLocaleString('en-US')})` : `0.00 CAKE`}</p>
            </div>
            <div className='text-lightText text-sm'>
              <p>იუზერები Squad-ით</p>
              {Number(squadUsers) >= 0 ? <p className=''>{Number(squadUsers) > 0 ? squadUsers : 0}</p> : <Skelaton />}
            </div>
          </div>
        </div>
      </Transition>
    </Card>
  )
}

export default Index
