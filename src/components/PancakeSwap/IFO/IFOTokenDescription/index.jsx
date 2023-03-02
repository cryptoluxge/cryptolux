import { Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import AddtoWallet from 'components/AddToWallet'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import WrongNetwork from 'components/ConnectWallet/Ethereum/WrongNetwork'
import { contract } from 'config/BNBChain/PancakeSwap/constants/contracts'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useToast } from 'hooks/useToast'
import { Fragment, useEffect, useState } from 'react'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { getBep20TokenContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import { shortAddress } from 'utils/WalletHelpers'
import { getExplorerURL } from 'utils/getExplorerURL'

const Index = () => {
  const { account, chainId, active } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const [isApproved, setIsApproved] = useState()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()
  const tokenContract = getBep20TokenContract(ifo[0].tokenDetails.address, chainId)

  async function checkApprove() {
    const approvalCheck = await tokenContract.methods.allowance(account, contract.router.contractAddress).call()
    if (approvalCheck > 0) {
      setIsApproved(true)
    } else {
      setIsApproved(false)
    }
  }

  async function handleApprove() {
    setIsLoading(true)
    await tokenContract.methods
      .approve(contract.router.contractAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
      .send({ from: account, gasLimit: ifo[0].gasLimits.approve })
      .once('transactionHash', (hash) => {
        toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
      })
      .on('error', (error) => {
        if (error.code === 4001) {
          toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
        } else if (error.code === -32003) {
          toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
        } else if (error.code === -32603) {
          toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
        } else {
          toast('error', 'არ დადასტურდა')
        }
        setIsLoading(false)
      })
      .then((receipt) => {
        if (receipt.status === true) {
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `${ifo[0].tokenDetails.symbol} გააქტირებულია ვაჭრობისთვის!`, receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
        }
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (active === true && chainId === 56) {
      const approveChecker = setInterval(() => {
        checkApprove()
      }, 3000)

      if (isApproved === true) {
        clearInterval(approveChecker)
      }
    }
    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <div className='mt-4'>
      <Card>
        <div className='flex items-center justify-between p-2 rounded-lg text-white bg-primary'>
          <div className='flex items-center gap-2'>
            <div className='flex md:hidden'>
              <Avatar src={ifo[0].tokenDetails.tokenLogo} alt={ifo[0].tokenDetails.name} className='w-12 rounded-full' />
            </div>
            <div>
              <p>{ifo[0].tokenDetails.name}</p>
              <p>ტოკენის შესახებ</p>
            </div>
          </div>
          <div className='hidden md:flex'>
            <div className='border-2 rounded-full'>
              <Avatar src={ifo[0].tokenDetails.tokenLogo} alt='PancakeSwap' className='w-12 rounded-full' />
            </div>
          </div>
          <div className='flex md:hidden' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <BsFillArrowUpCircleFill className='text-3xl cursor-pointer' /> : <BsFillArrowDownCircleFill className='text-3xl cursor-pointer' />}
          </div>
        </div>
        <div className='hidden md:flex'>
          <div className='w-full'>
            <div className='p-2 space-y-1'>
              <div className=''>
                {active ? (
                  <div>
                    {chainId === 56 ? (
                      <div>
                        {isApproved ? null : (
                          <Button id='approveButton' onClick={() => handleApprove()} loading={isLoading}>
                            Approve ვაჭრობისთვის
                          </Button>
                        )}
                      </div>
                    ) : (
                      <WrongNetwork changeTo='BSC' text='გადართე BSC ქსელზე' />
                    )}
                  </div>
                ) : null}
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>სახელი:</p>
                <p>{ifo[0].tokenDetails.name}</p>
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>სიმბოლო:</p>
                <p>{ifo[0].tokenDetails.symbol}</p>
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>სრული რაოდენობა:</p>
                <p>{ifo[0].tokenDetails.totalSupply}</p>
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>კონტრაქტი:</p>
                <div onClick={() => navigator.clipboard.writeText(ifo[0].tokenDetails.address)} className='flex items-center gap-1 hover:cursor-pointer'>
                  <a href={getExplorerURL('evm', 56, 'token', ifo[0].tokenDetails.address)} target='_blank' rel='noreferrer'>
                    {shortAddress(ifo[0].tokenDetails.address, 5)}
                  </a>
                  <FiCopy className='' />
                </div>
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>ვებ-გვერდი:</p>
                <a href={ifo[0].tokenDetails.website} target='_blank' rel='noreferrer'>
                  {ifo[0].tokenDetails.website}
                </a>
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>ტვიტერი:</p>
                <a href={`https://twitter.com/${ifo[0].tokenDetails.twitter}`} target='_blank' rel='noreferrer'>
                  @{ifo[0].tokenDetails.twitter}
                </a>
              </div>
              <div className='flex justify-between text-lightText text-sm'>
                <p className=''>ტელეგრამი:</p>
                <a href={`https://t.me/${ifo[0].tokenDetails.telegram}`} target='_blank' rel='noreferrer'>
                  @{ifo[0].tokenDetails.telegram}
                </a>
              </div>
              <div className='flex justify-center'>
                <AddtoWallet variant='text' address={ifo[0].tokenDetails.address} symbol={ifo[0].tokenDetails.symbol} decimal={ifo[0].tokenDetails.decimal} />
              </div>
              <div className='border-[1px] border-lightBorder  mt-2 mb-2'></div>
              <div className='text-lightText text-sm'>
                <p className=''>აღწერა:</p>
                <p className='text-sm'>{ifo[0].tokenDetails.description}</p>
              </div>
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
          <div className='p-3 space-y-1'>
            <div>{active ? <div>{chainId === 56 ? <div>{isApproved ? null : <Button onClick={() => handleApprove()}>Approve ვაჭრობისთვის</Button>}</div> : <WrongNetwork changeTo='BSC' text='გადართე BSC ქსელზე' />}</div> : null}</div>
            <div className='flex justify-between text-lightText'>
              <p className=''>სახელი:</p>
              <p>{ifo[0].tokenDetails.name}</p>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>სიმბოლო:</p>
              <p>{ifo[0].tokenDetails.symbol}</p>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>სრული რაოდენობა:</p>
              <p>{ifo[0].tokenDetails.totalSupply}</p>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>კონტრაქტი:</p>
              <div onClick={() => navigator.clipboard.writeText(ifo[0].tokenDetails.address)} className='flex items-center gap-1 hover:cursor-pointer'>
                <a href={getExplorerURL('evm', 56, 'token', ifo[0].tokenDetails.address)} target='_blank' rel='noreferrer'>
                  {shortAddress(ifo[0].tokenDetails.address, 5)}
                </a>
                <FiCopy className='' />
              </div>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>ვებ-გვერდი:</p>
              <a href={ifo[0].tokenDetails.website} target='_blank' rel='noreferrer'>
                {ifo[0].tokenDetails.website}
              </a>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>ტვიტერი:</p>
              <a href={`https://twitter.com/${ifo[0].tokenDetails.twitter}`} target='_blank' rel='noreferrer'>
                @{ifo[0].tokenDetails.twitter}
              </a>
            </div>
            <div className='flex justify-between text-lightText'>
              <p className=''>ტელეგრამი:</p>
              <a href={`https://t.me/${ifo[0].tokenDetails.telegram}`} target='_blank' rel='noreferrer'>
                @{ifo[0].tokenDetails.telegram}
              </a>
            </div>
            <div className='flex justify-center'>
              <AddtoWallet variant='text' address={ifo[0].tokenDetails.address} symbol={ifo[0].tokenDetails.symbol} decimal={ifo[0].tokenDetails.decimal} />
            </div>
            <div className='border-[1px] border-lightText  mt-2 mb-2'></div>
            <div className='text-lightText'>
              <p className=''>აღწერა:</p>
              <p>{ifo[0].tokenDetails.description}</p>
            </div>
          </div>
        </Transition>
      </Card>
    </div>
  )
}

export default Index
