import { Transition } from '@headlessui/react'
import Alert from 'components/Alerts'
import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import useBlockNumber from 'hooks/useBlocknumber'
import { useEffect, useState } from 'react'
import { BsDropletFill, BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { getIfoTokenPool } from 'utils/BNBChain/PancakeSwapHelpers/IfoHelpers'
import { shortAddress } from 'utils/WalletHelpers'
import FarmIcon from './FarmIcon'

const Index = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState([])
  const [currentBlockNumber] = useBlockNumber()

  const getData = async () => {
    const data = await getIfoTokenPool(ifo[0].tokenDetails.address, ifo[0].tokenDetails.decimal)
    setData(data)
  }

  useEffect(() => {
    getData()
  }, [currentBlockNumber])

  return (
    <div className='mt-4'>
      <Card>
        <div className='p-2 text-white bg-primary rounded-lg md:rounded-t-lg flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex md:hidden'>
              <FarmIcon token0Address={ifo[0].quoteTokenAddress} token1Address={ifo[0].tokenDetails.address} />
            </div>
            <div>
              <p>ლიკვიდურობა</p>
              <p>
                {ifo[0].tokenDetails.symbol}/{ifo[0].quoteToken} წყვილში
              </p>
            </div>
          </div>
          <div className='hidden md:flex'>
            <div className=''>
              <FarmIcon token0Address={ifo[0].quoteTokenAddress} token1Address={ifo[0].tokenDetails.address} />
            </div>
          </div>
          <div className='flex md:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <BsFillArrowUpCircleFill className='text-3xl cursor-pointer' /> : <BsFillArrowDownCircleFill className='text-3xl cursor-pointer' />}
          </div>
        </div>
        <div className='hidden md:flex'>
          <div className='w-full'>
            <div className='p-3'>
              {Object.keys(data).length > 0 ? (
                <div>
                  {data.pair ? (
                    <div>
                      {data.isAdded ? (
                        <div>
                          <div className='flex items-center gap-1'>
                            <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='Info' className='w-5 rounded-full' />
                            <p className='text-lightText text-sm'>ფასი: ${Number(data.price).toFixed(5)}</p>
                          </div>
                          <div className='border-[1px] border-lightBorder  mt-2 mb-2'></div>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-1'>
                              <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='Info' className='w-5 rounded-full' />
                              <p className='text-lightText text-sm'>ლიკვიდურობა: ${Number(Number(data.liquidity.token) * data.price).toLocaleString('en-US')}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Avatar src={`https://pancakeswap.finance/images/tokens/${ifo[0].quoteTokenAddress}.png`} alt='Info' className='w-5 rounded-full' />
                              <p className='text-lightText text-sm'>ლიკვიდურობა: ${Number(data.liquidity.busd).toLocaleString('en-US')}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <BsDropletFill className='text-lightText  text-xl' />
                              <p className='text-lightText text-sm'>სულ: ${Number(data.liquidity.total).toLocaleString('en-US')}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Avatar src='https://bscscan.com/images/brandassets/BscScan-logo-circle.jpg' alt='bscsan' className='w-5 rounded-full' />
                              <div className='flex items-center gap-1'>
                                <a href={`https://bscscan.com/address/${data.pair}`} target='_blank' rel='noreferrer' className='text-lightText text-sm'>
                                  ნახე BSCScan-ზე: {shortAddress(data.pair, 4)}
                                </a>
                                <FiCopy onClick={() => navigator.clipboard.writeText(data.pair)} className='text-lightText  cursor-pointer' />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Alert variant='info' text='ლიკვიდურობა დამატებული არაა' />
                          <div className='flex items-center gap-1 mt-2'>
                            <Avatar src='https://bscscan.com/images/brandassets/BscScan-logo-circle.jpg' alt='bscsan' className='w-5 rounded-full' />
                            <div className='flex items-center gap-1'>
                              <a href={`https://bscscan.com/address/${data.pair}`} target='_blank' rel='noreferrer' className='text-lightText text-sm'>
                                ნახე BSCScan-ზე: {shortAddress(data.pair, 4)}
                              </a>
                              <FiCopy onClick={() => navigator.clipboard.writeText(data.pair)} className='text-lightText  cursor-pointer' />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Alert variant='info' text='წყვილი შექმნილი არაა' />
                    </div>
                  )}
                </div>
              ) : null}
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
            <div className='p-3'>
              {Object.keys(data).length > 0 ? (
                <div>
                  {data.pair ? (
                    <div>
                      {data.isAdded ? (
                        <div>
                          <div className='flex items-center gap-1'>
                            <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='Info' className='w-5 rounded-full' />
                            <p className='text-lightText'>ფასი: ${Number(data.price).toFixed(5)}</p>
                          </div>
                          <div className='border-[1px] border-gray-200  mt-2 mb-2'></div>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-1'>
                              <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='Info' className='w-5 rounded-full' />
                              <p className='text-lightText'>ლიკვიდურობა: ${Number(Number(data.liquidity.token) * data.price).toLocaleString('en-US')}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Avatar src={`https://pancakeswap.finance/images/tokens/${ifo[0].quoteTokenAddress}.png`} alt='Info' className='w-5 rounded-full' />
                              <p className='text-lightText'>ლიკვიდურობა: ${Number(data.liquidity.busd).toLocaleString('en-US')}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <BsDropletFill className='text-lightText  text-xl' />
                              <p className='text-lightText'>სულ: ${Number(data.liquidity.total).toLocaleString('en-US')}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Avatar src='https://bscscan.com/images/brandassets/BscScan-logo-circle.jpg' alt='bscsan' className='w-5 rounded-full' />
                              <div className='flex items-center gap-1'>
                                <a href={`https://bscscan.com/address/${data.pair}`} target='_blank' rel='noreferrer' className='text-lightText'>
                                  ნახე BSCScan-ზე: {shortAddress(data.pair, 4)}
                                </a>
                                <FiCopy onClick={() => navigator.clipboard.writeText(data.pair)} className='text-lightText  cursor-pointer' />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Alert variant='info' text='ლიკვიდურობა დამატებული არაა' />
                          <div className='flex items-center gap-1 mt-2'>
                            <Avatar src='https://bscscan.com/images/brandassets/BscScan-logo-circle.jpg' alt='bscsan' className='w-5 rounded-full' />
                            <div className='flex items-center gap-1'>
                              <a href={`https://bscscan.com/address/${data.pair}`} target='_blank' rel='noreferrer' className='text-lightText'>
                                ნახე BSCScan-ზე: {shortAddress(data.pair, 4)}
                              </a>
                              <FiCopy onClick={() => navigator.clipboard.writeText(data.pair)} className='text-lightText  cursor-pointer' />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Alert variant='info' text='წყვილი შექმნილი არაა' />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Transition>
      </Card>
    </div>
  )
}

export default Index
