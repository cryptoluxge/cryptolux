import { Tab } from '@headlessui/react'
import Mina from 'assets/images/Blockchains/Mina.svg'
import AddressBookButton from 'components/AddresBookButton'
import Alert from 'components/Alerts'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import MiniCard from 'components/Cards/MiniCard'
import AddressComponent from 'components/CryptoComponents/AddressComponent'
import Input from 'components/Input'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { BsFillPiggyBankFill } from 'react-icons/bs'
import { getCoinPriceID } from 'utils/APIs/CryptoRankAPI'
import { getAccount, getAccountTxs, getAccountTxsCount, getDelegatee, getHasStaking, getStakingData, getStakingFullData } from 'utils/APIs/MinaAPI'

const Index = () => {
  const [minaPrice, setMinaPrice] = useState(0)
  const [data, setData] = useState([])
  const [accountTxs, setAccountTxs] = useState([])
  const [incomingTxs, setIncomingTxs] = useState([])
  const [outgoingTxs, setOutgoingTxs] = useState([])
  const [isStaking, setIsStaking] = useState('')
  const [delegatedTo, setDelegatedTo] = useState([])
  const [stakingData, setStakingData] = useState([])
  const [stakingFullData, setStakingFullData] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean)
  const [isFetching, setIsFetching] = useState(true)
  const toast = useToast()

  const fetchData = async () => {
    setIsFetching(true)
    const walletAddress = document.getElementById('walletAddress').value

    if (walletAddress === '') {
      toast('error', 'გთხოვთ, შეიყვანოთ მისამართი!')
    } else {
      setIsLoading(true)

      const getMinaPrice = await getCoinPriceID('mina-protocol')
      setMinaPrice(getMinaPrice)

      const getMinaAccount = await getAccount(walletAddress)
      setData(getMinaAccount)

      const getTxs = await getAccountTxs(walletAddress)
      setAccountTxs(getTxs)

      const getIncomingTxs = await getAccountTxsCount(walletAddress, 'incoming')
      setIncomingTxs(getIncomingTxs)

      const getOutgoingTxs = await getAccountTxsCount(walletAddress, 'outgoing')
      setOutgoingTxs(getOutgoingTxs)

      const getIsStaking = await getHasStaking(walletAddress)
      if (getIsStaking.status === 200) {
        if (getIsStaking.data === true) {
          const getDelegatedTo = await getDelegatee(walletAddress)
          setDelegatedTo(getDelegatedTo)

          const getStakingInfo = await getStakingData(walletAddress)
          setStakingData(getStakingInfo)

          if (getStakingInfo.status === 200) {
            const getStakingFullInfo = await getStakingFullData(walletAddress, getStakingInfo.data.data[0].hash, getStakingInfo.data.data[0].activationEpoch)
            setStakingFullData(getStakingFullInfo)
          }

          if (getDelegatedTo.status === 200) {
            setIsStaking(getDelegatedTo.data.delegateeName)
          }
        } else {
          setIsStaking('არა')
        }
      }
      setIsFetching(false)
      setIsLoading(false)
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-full md:w-[500px]'>
          <Card title='MINA-ს საფულის შემოწმება' titleBorder={true}>
            <div className='p-2'>
              <div className='flex items-center gap-2'>
                <Input type='text' name='minaWallet' id='walletAddress' placeholder='შეიყვანეთ საფულის მისამართი' />
                <AddressBookButton />
              </div>
              <div className='mt-2'>
                <Button onClick={() => fetchData()} loading={isLoading}>
                  შემოწმება
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {isFetching === false ? (
        <div>
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full mt-2'>
            {data.status === 200 && (
              <div>
                <MiniCard title='ბალანსი' data={`${data.data.value} ($${(data.data.value * minaPrice).toLocaleString('en-US')})`} isLoading={isLoading} icon={<img src={Mina} alt='Mina' className='w-7' />} />
              </div>
            )}
            {incomingTxs.status === 200 && (
              <div>
                <MiniCard title='შემოსული TXs' data={incomingTxs.data.value} isLoading={isLoading} icon={<AiOutlineArrowDown className='text-2xl text-white' />} />
              </div>
            )}
            {outgoingTxs.status === 200 && (
              <div>
                <MiniCard title='გასული TXs' data={outgoingTxs.data.value} isLoading={isLoading} icon={<AiOutlineArrowUp className='text-2xl text-white' />} />
              </div>
            )}
            {delegatedTo.status === 200 && (
              <div>
                <MiniCard title='სტეიკზეა' data={isStaking} isLoading={isLoading} icon={<BsFillPiggyBankFill className='text-3xl text-white' />} />
              </div>
            )}
          </div>
          <div>
            <div className='mt-2'>
              <Tab.Group>
                <div className='w-full md:w-[500px] mb-2'>
                  <Tab.List className='flex rounded-xl bg-primary p-1 space-x-2'>
                    <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                      <div className='flex items-center justify-center gap-2'>
                        <p className='font-light text-white'>ტრანზაქციები</p>
                      </div>
                    </Tab>
                    <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                      <div className='flex items-center justify-center gap-2'>
                        <p className='font-light text-white'>Staking</p>
                      </div>
                    </Tab>
                    <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                      <div className='flex items-center justify-center gap-2'>
                        <p className='font-light text-white'>Staking Details</p>
                      </div>
                    </Tab>
                  </Tab.List>
                </div>
                <Tab.Panels>
                  <Tab.Panel>
                    <Card title='ტრანზაქციები' titleBorder={true}>
                      {accountTxs.status === 200 ? (
                        <div>
                          {accountTxs.data.data.length > 0 ? (
                            <Table>
                              <Thead>
                                <HeadTr>
                                  <HeadTh>
                                    #
                                  </HeadTh>
                                  <HeadTh>
                                    ტიპი
                                  </HeadTh>
                                  <HeadTh>
                                    OUT/IN
                                  </HeadTh>
                                  <HeadTh>
                                    მიმღები
                                  </HeadTh>
                                  <HeadTh>
                                    სტატუსი
                                  </HeadTh>
                                  <HeadTh>
                                    რაოდენობა
                                  </HeadTh>
                                  <HeadTh>
                                    საკომისიო
                                  </HeadTh>
                                  <HeadTh>
                                    ბლოკი
                                  </HeadTh>
                                </HeadTr>
                              </Thead>
                              <Tbody>
                                {accountTxs.data.data.map((x, index) => (
                                  <BodyTr key={index}>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1} rightCorner={index === accountTxs.data.data.length - 1}>
                                      <Typography>{index + 1}</Typography>
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1}>
                                      <Typography>{String(x.type).charAt(0).toUpperCase() + x.type.slice(1)}</Typography>
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1}>
                                      <div className={` text-center ${x.direction === 'IN' ? 'border-[1px] border-green-400 bg-green-800 rounded-lg p-1' : 'border-[1px] border-yellow-400 bg-yellow-800 rounded-lg p-1'}`}>
                                        <Typography color='text-white'>{x.direction}</Typography>
                                      </div>
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1}>
                                      {x.accountName !== null ? (
                                        <div className='flex flex-col'>
                                          <Typography>{x.accountName}</Typography>
                                          <AddressComponent address={x.account} chain='MINA' type='wallet' chainId={0} />
                                        </div>
                                      ) : (
                                        <AddressComponent address={x.account} chain='MINA' type='wallet' chainId={0} />
                                      )}
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1}>
                                      <div className={` text-center ${x.status === 'applied' ? 'border-[1px] border-green-400 bg-green-800 rounded-lg p-1' : 'border-[1px] border-yellow-400 bg-yellow-800 rounded-lg p-1'}`}>
                                        <Typography color='text-white'>{String(x.status).charAt(0).toUpperCase() + x.status.slice(1)}</Typography>
                                      </div>
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1}>
                                      <div className='flex items-center gap-1'>
                                        <Typography>{x.amount}</Typography>
                                        <Typography>{`($${(Number(x.amount) * minaPrice).toLocaleString('en-US')})`}</Typography>
                                      </div>
                                      <Typography className='text-sm' color='text-zinc-600'>
                                        MINA
                                      </Typography>
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1}>
                                      <div className='flex items-center gap-1'>
                                        <Typography>{x.fee}</Typography>
                                        <Typography>{`($${(Number(x.fee) * minaPrice).toLocaleString('en-US')})`}</Typography>
                                      </div>
                                      <Typography className='text-sm' color='text-zinc-600'>
                                        MINA
                                      </Typography>
                                    </BodyTd>
                                    <BodyTd isLast={index !== accountTxs.data.data.length - 1} leftCorner={index === accountTxs.data.data.length - 1}>
                                      <Typography>{x.block}</Typography>
                                    </BodyTd>
                                  </BodyTr>
                                ))}
                              </Tbody>
                            </Table>
                          ) : (
                            <div className='p-2'>
                              <Alert variant='info' text='ამ მისამართზე ტრანზაქციები არ არის.' />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='p-2'>
                          <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
                        </div>
                      )}
                    </Card>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Card title='Staking' titleBorder={true}>
                      {stakingData.status === 200 ? (
                        <div>
                          {stakingData.data.data.length > 0 ? (
                            <Table>
                              <Thead>
                                <HeadTr>
                                  <HeadTh>
                                    ვალიდატორი
                                  </HeadTh>
                                  <HeadTh>
                                    დასტეიკებული
                                  </HeadTh>
                                  <HeadTh>
                                    დაგროვებული
                                  </HeadTh>
                                  <HeadTh>
                                    საშ. თითო ეპოქაში
                                  </HeadTh>
                                  <HeadTh>
                                    დასტეიკების ეპოქა
                                  </HeadTh>
                                  <HeadTh>
                                    სტეიკის სტატუსი
                                  </HeadTh>
                                </HeadTr>
                              </Thead>
                              <Tbody>
                                {stakingData.data.data.map((x, index) => (
                                  <BodyTr key={index}>
                                    <BodyTd isLast={index !== stakingData.data.data.length - 1} rightCorner={index === stakingData.data.data.length - 1}>
                                      <div className='flex items-center gap-2'>
                                        <Avatar src={x?.valImg !== null ? x?.valImg : ''} alt='logo' className='w-8 rounded-full' />
                                        <Typography>{x.valName !== null ? x.valName : 'უსახელო'}</Typography>
                                      </div>
                                    </BodyTd>
                                    <BodyTd isLast={index !== stakingData.data.data.length - 1}>
                                      <div className='flex items-center gap-1'>
                                        <Typography>{Number(x.delegateAmount).toLocaleString('en-US')}</Typography>
                                        <Typography>{`($${(Number(x.delegateAmount) * minaPrice).toLocaleString('en-US')})`}</Typography>
                                      </div>
                                    </BodyTd>
                                    <BodyTd isLast={index !== stakingData.data.data.length - 1}>
                                      <div className='flex items-center gap-1'>
                                        <Typography>{Number(x.totalEpochReward).toLocaleString('en-US')}</Typography>
                                        <Typography>{`($${(Number(x.totalEpochReward) * minaPrice).toLocaleString('en-US')})`}</Typography>
                                      </div>
                                    </BodyTd>
                                    <BodyTd isLast={index !== stakingData.data.data.length - 1}>
                                      <div className='flex items-center gap-1'>
                                        <Typography>{Number(x.avgEpochReward).toLocaleString('en-US')}</Typography>
                                        <Typography>{`($${(Number(x.avgEpochReward) * minaPrice).toLocaleString('en-US')})`}</Typography>
                                      </div>
                                    </BodyTd>
                                    <BodyTd>
                                      <Typography>{x.txEpoch}</Typography>
                                    </BodyTd>
                                    <BodyTd isLast={index !== stakingData.data.data.length - 1} leftCorner={index === stakingData.data.data.length - 1}>
                                      <div className={` text-center ${x.status === 'ACTIVE' ? 'border-[1px] border-green-400 bg-green-800 rounded-lg p-1' : 'border-[1px] border-yellow-400 bg-yellow-800 rounded-lg p-1'}`}>
                                        <Typography color='text-white'>{String(x.status).charAt(0).toUpperCase() + x.status.slice(1)}</Typography>
                                      </div>
                                    </BodyTd>
                                  </BodyTr>
                                ))}
                              </Tbody>
                            </Table>
                          ) : (
                            <div className='p-2'>
                              <Alert variant='info' text='ამ მისამართით MINA დასტეიკებული არ არის.' />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='p-2'>
                          <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
                        </div>
                      )}
                    </Card>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Card title='Staking Details' titleBorder={true}>
                      {stakingFullData.status === 200 ? (
                        <div>
                          {stakingFullData.data.length > 0 ? (
                            <div className='overflow-y-auto'>
                              <Table>
                                <Thead>
                                  <HeadTr>
                                    <HeadTh>
                                      დასტეიკებული
                                    </HeadTh>
                                    <HeadTh>
                                      სტატუსი
                                    </HeadTh>
                                    <HeadTh>
                                      ეპოქა
                                    </HeadTh>
                                    <HeadTh>
                                      ჯილდო
                                    </HeadTh>
                                    <HeadTh>
                                      ეპოქის ჯიდლო
                                    </HeadTh>
                                    <HeadTh>
                                      Supercharged Rewards
                                    </HeadTh>
                                  </HeadTr>
                                </Thead>
                                <Tbody>
                                  {stakingFullData.data.map((x, index) => (
                                    <BodyTr key={index}>
                                      <BodyTd isLast={index !== stakingFullData.data.length - 1} rightCorner={index === stakingFullData.data.length - 1}>
                                        <Typography>{x.amountDelegated !== null ? Number(x.amountDelegated).toFixed(5) : '-'}</Typography>
                                      </BodyTd>
                                      <BodyTd isLast={index !== stakingFullData.data.length - 1}>
                                        <div className={` text-center ${x.delegationStatus === 'ACTIVE' ? 'border-[1px] border-green-400 bg-green-800 rounded-lg p-1' : 'border-[1px] border-yellow-400 bg-yellow-800 rounded-lg p-1'}`}>
                                          <Typography color='text-white'>{String(x.delegationStatus).charAt(0).toUpperCase() + x.delegationStatus.slice(1)}</Typography>
                                        </div>
                                      </BodyTd>
                                      <BodyTd isLast={index !== stakingFullData.data.length - 1}>
                                        <Typography>ეპოქა {x.epoch}</Typography>
                                      </BodyTd>
                                      <BodyTd isLast={index !== stakingFullData.data.length - 1}>
                                        <Typography>{x.cumulativeRewards !== null ? Number(x.cumulativeRewards).toFixed(5) : '-'}</Typography>
                                      </BodyTd>
                                      <BodyTd isLast={index !== stakingFullData.data.length - 1}>
                                        <Typography>{x.epochRewards !== null ? Number(x.epochRewards).toFixed(5) : '-'}</Typography>
                                      </BodyTd>
                                      <BodyTd isLast={index !== stakingFullData.data.length - 1} leftCorner={index === stakingFullData.data.length - 1}>
                                        <Typography>{x.superchargedRewards !== null ? Number(x.superchargedRewards).toFixed(5) : '-'}</Typography>
                                      </BodyTd>
                                    </BodyTr>
                                  ))}
                                </Tbody>
                              </Table>
                            </div>
                          ) : (
                            <div className='p-2'>
                              <Alert variant='info' text='ამ მისამართით MINA დასტეიკებული არ არის.' />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='p-2'>
                          <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
                        </div>
                      )}
                    </Card>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Index
