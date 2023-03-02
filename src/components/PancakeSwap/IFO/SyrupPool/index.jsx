import { Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'
import Loading from 'components/Skelaton'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useCakePrice } from 'hooks/useDexTokenPrices'
import { Fragment, useEffect, useState } from 'react'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { getUserSyrupPoolData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
import { getIfoTokenPrice } from 'utils/BNBChain/PancakeSwapHelpers/IfoHelpers'
import Buttons from './Buttons'

const Index = () => {
  const { account, active, chainId } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const [cakePrice, setCakePrice] = useState(0)
  const [tokenPrice, setTokenPrice] = useState(0)
  const [userData, setUserData] = useState([])

  const GetUserData = async () => {
    const getCakePrice = await useCakePrice()
    setCakePrice(getCakePrice)
    if (ifo[0].syrupPoolAddress !== null) {
      const data = await getUserSyrupPoolData(ifo[0].syrupPoolAddress, account, ifo[0].tokenDetails.symbol)
      setUserData(data)
      const tokenPrice = await getIfoTokenPrice(ifo[0].tokenDetails.address, ifo[0].tokenDetails.decimal)
      setTokenPrice(tokenPrice)
    }
  }

  useEffect(() => {
    if (active && chainId === 56) {
      GetUserData()
    }
    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <div className='mt-4'>
      <Card>
        <div className='p-2 text-white bg-primary rounded-lg md:rounded-t-lg flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex md:hidden'>
              <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='Info' className='w-12 rounded-full' />
            </div>
            <div>
              <p>Syrup Pool</p>
              <p>Stake CAKE Earn {ifo[0].tokenDetails.symbol}</p>
            </div>
          </div>
          <div className='hidden md:flex'>
            <div className='border-2 rounded-full'>
              <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='Info' className='w-12 rounded-full' />
            </div>
          </div>
          <div className='flex md:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <BsFillArrowUpCircleFill className='text-3xl cursor-pointer' /> : <BsFillArrowDownCircleFill className='text-3xl cursor-pointer' />}
          </div>
        </div>
        <div className='hidden md:flex'>
          <div className='w-full'>
            <div className='p-3'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center gap-2'>
                  <Avatar src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg' alt='PancakeSwap' className='w-10' />
                  <div className='text-lightText'>
                    <p className='text-lightText text-sm'>დასტეიკებული CAKE</p>
                    {ifo[0].syrupPoolAddress === null ? (
                      <div className='flex items-center gap-1'>
                        <p className=''>0.000</p>
                        <p className='text-sm'>($0.000)</p>
                      </div>
                    ) : (
                      <div>
                        {Object.keys(userData).length > 0 ? (
                          <div className='flex items-center gap-1'>
                            <p className=''>{Number(userData.userStaked).toLocaleString('en-US')}</p>
                            <p className='text-sm'>(${(Number(userData.userStaked) * cakePrice).toLocaleString('en-US')})</p>
                          </div>
                        ) : (
                          <Loading />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='PancakeSwap' className='w-10 rounded-full' />
                  <div className='text-lightText'>
                    <p className='text-lightText text-sm'>დაგროვებული {ifo[0].tokenDetails.symbol}</p>
                    {ifo[0].syrupPoolAddress === null ? (
                      <div>
                        <div className='flex items-center gap-1'>
                          <p className=''>0.000</p>
                          <p className='text-sm'>($0.000)</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {Object.keys(userData).length > 0 ? (
                          <div className='flex items-center gap-1'>
                            <p className=''>{Number(userData.userPending).toLocaleString('en-US')}</p>
                            <p className='text-sm'>(${(Number(userData.userPending) * tokenPrice).toLocaleString('en-US')})</p>
                          </div>
                        ) : (
                          <Loading />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {ifo[0].syrupPoolAddress === null ? (
                <div className='mt-3'>
                  <Alert variant='info' text='კონტრაქტი გაშვებული არაა' />
                </div>
              ) : (
                <div className='mt-3'>
                  <Buttons name={ifo[0].tokenDetails.symbol} poolContract={ifo[0].syrupPoolAddress} stakedCake={userData.userStaked} />
                </div>
              )}
            </div>
          </div>
        </div>
        <Transition
          show={isOpen}
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 translate-y-0'
          enterTo='transform opacity-100 translate-y-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 translate-y-100'
          leaveTo='transform opacity-0 translate-y-0'>
          <div>
            <div className='p-3'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center gap-2'>
                  <Avatar src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg' alt='PancakeSwap' className='w-10' />
                  <div className='text-lightText'>
                    <p className='text-lightText'>დასტეიკებული CAKE</p>
                    {ifo[0].syrupPoolAddress === null ? (
                      <div className='flex items-center gap-1'>
                        <p className=''>0.000</p>
                        <p className='text-sm'>($0.000)</p>
                      </div>
                    ) : (
                      <div>
                        {Object.keys(userData).length > 0 ? (
                          <div className='flex items-center gap-1'>
                            <p className=''>{Number(userData.userStaked).toLocaleString('en-US')}</p>
                            <p className='text-sm'>(${(Number(userData.userStaked) * cakePrice).toLocaleString('en-US')})</p>
                          </div>
                        ) : (
                          <Loading />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='PancakeSwap' className='w-10 rounded-full' />
                  <div className='text-lightText'>
                    <p className='text-lightText'>დაგროვებული {ifo[0].tokenDetails.symbol}</p>
                    {ifo[0].syrupPoolAddress === null ? (
                      <div>
                        <div className='flex items-center gap-1'>
                          <p className=''>0.000</p>
                          <p className='text-sm'>($0.000)</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {Object.keys(userData).length > 0 ? (
                          <div className='flex items-center gap-1'>
                            <p className=''>{Number(userData.userPending).toLocaleString('en-US')}</p>
                            <p className='text-sm'>(${(Number(userData.userPending) * tokenPrice).toLocaleString('en-US')})</p>
                          </div>
                        ) : (
                          <Loading />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {ifo[0].syrupPoolAddress === null ? (
                <div className='mt-3'>
                  <Alert variant='info' text='კონტრაქტი გაშვებული არაა' />
                </div>
              ) : (
                <div className='mt-3'>
                  <Buttons name={ifo[0].tokenDetails.symbol} poolContract={ifo[0].syrupPoolAddress} stakedCake={userData.userStaked} />
                </div>
              )}
            </div>
          </div>
        </Transition>
      </Card>
    </div>
  )
}

export default Index
