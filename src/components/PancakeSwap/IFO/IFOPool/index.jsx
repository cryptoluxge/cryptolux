import { Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import WrongNetwork from 'components/ConnectWallet/Ethereum/WrongNetwork'
import Skelaton from 'components/Skelaton'
import { useEffect, useState } from 'react'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { MdOpenInNew } from 'react-icons/md'
import { getCakeVaultV2IsApproved, getTotalCakeLocked, getTotalStakedCake, getVaultUserData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'

const Index = () => {
  const { account, active, chainId } = useWeb3React()
  const [isApproved, setIsApproved] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState([])
  const [totalCakeStaked, setTotalCakeStaked] = useState(0)
  const [totalCakeLocked, setTotalCakeLocked] = useState(0)

  const getUserData = async () => {
    const approved = await getCakeVaultV2IsApproved(account)
    const user = await getVaultUserData(account)
    setUserData(user)
    setIsApproved(approved)
  }

  const getPoolData = async () => {
    const cakeStaked = await getTotalStakedCake()
    const cakeLocked = await getTotalCakeLocked()
    setTotalCakeStaked(cakeStaked)
    setTotalCakeLocked(cakeLocked)
  }

  useEffect(() => {
    getPoolData()
    if (active === true && chainId === 56) {
      getUserData()
    }
    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <Card>
      <div>
        <div className='p-2 text-white bg-primary rounded-lg md:rounded-t-lg flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex md:hidden'>
              <div>
                <Avatar src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg' alt='PancakeSwap' className='w-12' />
              </div>
            </div>
            <div>
              <p>Stake CAKE</p>
              <p>Earn, IFO and more!</p>
            </div>
          </div>
          <div className='hidden md:flex'>
            <div className='border-2 rounded-full'>
              <Avatar src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg' alt='PancakeSwap' className='w-12' />
            </div>
          </div>
          <div className='flex md:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <BsFillArrowUpCircleFill className='text-3xl cursor-pointer' /> : <BsFillArrowDownCircleFill className='text-3xl cursor-pointer' />}
          </div>
        </div>
        <div className='hidden md:block'>
          {userData.isLocked ? null : (
            <div className='p-2'>
              <Alert variant='info' text='IFO-ს Public Sale-ში რომ მიიღოთ მონაწილეობა აუცილებელია დალუქოთ CAKE.' />
            </div>
          )}
          <div>
            {active ? (
              <div className='p-2 flex flex-col space-y-3'>
                <div className='text-lightText text-sm'>
                  <p>{userData.isLocked ? 'დალუქული' : 'შეტანილი'} CAKE</p>
                  {Number(userData.cakeAmount) >= 0 ? <p className=''>{Number(userData.cakeAmount).toFixed(4)}</p> : <Skelaton width='14' />}
                </div>
                <div className='text-lightText text-sm'>
                  <p>დაგროვებული</p>
                  {Number(userData.pendingAmount) >= 0 ? <p className=''>{Number(userData.pendingAmount).toFixed(4)}</p> : <Skelaton width='14' />}
                </div>
                <div className='text-lightText text-sm'>
                  <p>iCAKE</p>
                  {Number(userData.depositedCake) >= 0 ? <p className=''>{Number(userData.depositedCake).toFixed(4)}</p> : <Skelaton width='14' />}
                </div>
                {userData.isLocked ? (
                  <div className='text-lightText text-sm'>
                    <p>განიბლოკება</p>
                    <p className=''>{userData.lockEndTime.date}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            {active ? (
              <div className='px-2'>
                {chainId === 56 ? (
                  <div>
                    {isApproved ? (
                      <div>
                        {userData.isLocked ? null : (
                          <div className='space-y-2'>
                            <Button disabled={true}>შეტანა</Button>
                            <Button disabled={true}>გამოტანა</Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button>Enable</Button>
                    )}
                  </div>
                ) : (
                  <WrongNetwork changeTo='BSC' text='გადართე BSC ქსელზე' />
                )}
              </div>
            ) : (
              <div className='mt-2 px-2'>
                <ConnectButton text='დააკავშირე საფულე' />
              </div>
            )}
          </div>
          <div className='p-2'>
            <div className='border-[1px] border-lightBorder  rounded-lg mb-3'></div>
            <div className='flex justify-between text-lightText text-sm'>
              <p className=''>Total Staked:</p>
              {Number(totalCakeStaked) > 0 ? <p>{Number(totalCakeStaked).toLocaleString('en-US')}</p> : <Skelaton width='14' />}
            </div>
            <div className='flex justify-between text-lightText text-sm'>
              <p className=''>Total Locked:</p>
              {Number(totalCakeLocked) > 0 ? <p>{Number(totalCakeLocked).toLocaleString('en-US')}</p> : <Skelaton width='14' />}
            </div>
            <a href='https://bscscan.com/address/0x45c54210128a065de780C4B0Df3d16664f7f859e' rel='noreferrer' target='_blank' className='mt-2 flex justify-end text-lightText  items-center'>
              <p className='text-sm'>ნახე კონტრაქტი</p>
              <MdOpenInNew />
            </a>
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
          <div>
            {active ? (
              <div className='p-3 flex flex-col space-y-3'>
                <div className='text-lightText'>
                  <p>{userData.isLocked ? 'დალუქული' : 'დასტეიკებული'}</p>
                  {Number(userData.cakeAmount) >= 0 ? <p className=''>{Number(userData.cakeAmount).toFixed(4)}</p> : <Skelaton width='14' />}
                </div>
                <div className='text-lightText'>
                  <p>დაგროვებული</p>
                  {Number(userData.pendingAmount) >= 0 ? <p className=''>{Number(userData.pendingAmount).toFixed(4)}</p> : <Skelaton width='14' />}
                </div>
                <div className='text-lightText'>
                  <p>iCAKE</p>
                  {Number(userData.depositedCake) >= 0 ? <p className=''>{Number(userData.depositedCake).toFixed(4)}</p> : <Skelaton width='14' />}
                </div>
                {userData.isLocked ? (
                  <div className='text-lightText'>
                    <p>განიბლოკება</p>
                    <p className=''>{userData.lockEndTime.date}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <div>
              {active ? (
                <div>
                  {chainId === 56 ? (
                    <div>
                      {isApproved ? (
                        <div>
                          {userData.isLocked ? null : (
                            <div className='space-y-2 px-3'>
                              <Button>შეტანა</Button>
                              <Button>გამოტანა</Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button>Enable</Button>
                      )}
                    </div>
                  ) : (
                    <div className='px-3'>
                      <WrongNetwork changeTo='BSC' text='გადართე BSC ქსელზე' />
                    </div>
                  )}
                </div>
              ) : (
                <div className='mt-2 px-3'>
                  <ConnectButton text='დააკავშირე საფულე' />
                </div>
              )}
            </div>
          </div>
          <div className='p-3'>
            <div className='border-[1px] border-lightText  rounded-lg mb-3'></div>
            <div className='flex justify-between text-lightText'>
              <p className=''>Total Staked:</p>
              <p>{Number(totalCakeStaked).toLocaleString('en-US')}</p>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>Total Locked:</p>
              <p>{Number(totalCakeLocked).toLocaleString('en-US')}</p>
            </div>
            <a href='https://bscscan.com/address/0x45c54210128a065de780C4B0Df3d16664f7f859e' rel='noreferrer' target='_blank' className='mt-2 flex justify-end text-lightText  items-center'>
              <p className='text-sm'>ნახე კონტრაქტი</p>
              <MdOpenInNew />
            </a>
          </div>
        </div>
      </Transition>
    </Card>
  )
}

export default Index
