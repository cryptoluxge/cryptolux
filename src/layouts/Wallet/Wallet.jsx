import { Tab } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import ARBITRUM from 'assets/images/Blockchains/Arbitrum.svg'
import AVAX from 'assets/images/Blockchains/Avalanche.svg'
import BSC from 'assets/images/Blockchains/Binance.svg'
import CRONOS from 'assets/images/Blockchains/Cronos.svg'
import ETH from 'assets/images/Blockchains/Ethereum.svg'
import FANTOM from 'assets/images/Blockchains/Fantom.svg'
import MATIC from 'assets/images/Blockchains/Matic.svg'
import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import { useEffect, useState } from 'react'
import { getNativeTransactions, getTokenBalances } from 'utils/APIs/MoralisAPI'
import TokensTable from './Tables/TokensTable'
import TransactionsTable from './Tables/TransactionsTable'

const Index = () => {
  const { account, active } = useWeb3React()
  const [isLoading, setIsLoading] = useState(Boolean)
  const [isTxLoading, setIsTxLoading] = useState(Boolean)
  const [bscTokenBalance, setBscTokenBalance] = useState([])
  const [ethTokenBalance, setEthTokenBalance] = useState([])
  const [avaxTokenBalance, setAvaxTokenBalance] = useState([])
  const [maticTokenBalance, setMaticTokenBalance] = useState([])
  const [fantomTokenBalance, setFantomTokenBalance] = useState([])
  const [cronosTokenBalance, setCronosTokenBalance] = useState([])
  const [arbitrumTokenBalance, setArbitrumTokenBalance] = useState([])

  const [bscNativeTxs, setBscNativeTxs] = useState([])
  const [ethNativeTxs, setEthNativeTxs] = useState([])
  const [avaxNativeTxs, setAvaxNativeTxs] = useState([])
  const [maticNativeTxs, setMaticNativeTxs] = useState([])
  const [ftmNativeTxs, setFtmNativeTxs] = useState([])
  const [croNativeTxs, setCroNativeTxs] = useState([])
  const [arbiNativeTxs, setArbiNativeTxs] = useState([])

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const getTokenBalancesOnEVMChains = async () => {
    setIsLoading(true)

    const tokenBalanceBSC = await getTokenBalances(account, 'bsc')
    setBscTokenBalance(tokenBalanceBSC)

    const tokenBalanceETH = await getTokenBalances(account, 'eth')
    setEthTokenBalance(tokenBalanceETH)

    const tokenBalanceAVAX = await getTokenBalances(account, 'avalanche')
    setAvaxTokenBalance(tokenBalanceAVAX)

    const tokenBalanceMATIC = await getTokenBalances(account, 'matic')
    setMaticTokenBalance(tokenBalanceMATIC)

    const tokenBalanceFTM = await getTokenBalances(account, 'fantom')
    setFantomTokenBalance(tokenBalanceFTM)

    const tokenBalanceCRO = await getTokenBalances(account, 'cronos')
    setCronosTokenBalance(tokenBalanceCRO)

    const tokenBalanceARBI = await getTokenBalances(account, 'arbitrum')
    setArbitrumTokenBalance(tokenBalanceARBI)

    setIsLoading(false)
  }

  const getNativeTransactionsOnEVMChains = async () => {
    setIsTxLoading(true)

    const nativeTxsBSC = await getNativeTransactions(account, 'bsc')
    setBscNativeTxs(nativeTxsBSC)

    const nativeTxsETH = await getNativeTransactions(account, 'eth')
    setEthNativeTxs(nativeTxsETH)

    const nativeTxsAVAX = await getNativeTransactions(account, 'avalanche')
    setAvaxNativeTxs(nativeTxsAVAX)

    const nativeTxsMATIC = await getNativeTransactions(account, 'matic')
    setMaticNativeTxs(nativeTxsMATIC)

    const nativeTxsFTM = await getNativeTransactions(account, 'fantom')
    setFtmNativeTxs(nativeTxsFTM)

    const nativeTxsCRO = await getNativeTransactions(account, 'cronos')
    setCroNativeTxs(nativeTxsCRO)

    const nativeTxsARBI = await getNativeTransactions(account, 'arbitrum')
    setArbiNativeTxs(nativeTxsARBI)

    setIsTxLoading(false)
  }

  useEffect(() => {
    if (active === true) {
      getTokenBalancesOnEVMChains()
      getNativeTransactionsOnEVMChains()
    }

    // eslint-disable-next-line
  }, [active])

  return (
    <div>
      <div>
        <div className='w-full'>
          <Tab.Group>
            <div className='w-full md:w-[500px] mb-3'>
              <Tab.List className='flex flex-col md:flex-row rounded-xl bg-primary p-1 md:space-x-2'>
                <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='font-light text-white'>ტრანზაქციები</p>
                  </div>
                </Tab>
                <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='font-light text-white'>ტოკენების ბალანსი</p>
                  </div>
                </Tab>
              </Tab.List>
            </div>
            <Tab.Panels>
              <Tab.Panel>
                <Card title='ტრანზაქციები' titleBorder={true}>
                  <div className='bg-lightCard rounded-lg w-full mt-2'>
                    <Tab.Group as='div'>
                      <div className='px-2'>
                        <Tab.List className='flex w-full overflow-y-auto rounded-xl bg-primary p-1 gap-1'>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5 ', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2'>
                              <Avatar src={BSC} alt='' className='w-4' />
                              <p className='font-bold text-white '>BSC</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={ETH} alt='' className='w-3' />
                              <p className='font-bold text-white '>ETH</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={AVAX} alt='' className='w-4' />
                              <p className='font-bold text-white '>AVAX</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={MATIC} alt='' className='w-4' />
                              <p className='font-bold text-white '>MATIC</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={FANTOM} alt='' className='w-3' />
                              <p className='font-bold text-white '>FTM</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={CRONOS} alt='' className='w-4' />
                              <p className='font-bold text-white '>CRO</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={ARBITRUM} alt='' className='w-4' />
                              <p className='font-bold text-white '>ARB</p>
                            </div>
                          </Tab>
                        </Tab.List>
                      </div>
                      <div className='border-[1px] border-lightBorder mt-2'></div>
                      {active ? (
                        <Tab.Panels>
                          <Tab.Panel>
                            <TransactionsTable data={bscNativeTxs} chainId={56} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TransactionsTable data={ethNativeTxs} chainId={1} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TransactionsTable data={avaxNativeTxs} chainId={43114} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TransactionsTable data={maticNativeTxs} chainId={137} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TransactionsTable data={ftmNativeTxs} chainId={250} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TransactionsTable data={croNativeTxs} chainId={25} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TransactionsTable data={arbiNativeTxs} chainId={42161} isTxLoading={isTxLoading} />
                          </Tab.Panel>
                        </Tab.Panels>
                      ) : (
                        <div className='py-5 flex justify-center'>
                          <ConnectButton text='დააკავშირეთ საფულე' />
                        </div>
                      )}
                    </Tab.Group>
                  </div>
                </Card>
              </Tab.Panel>
              <Tab.Panel>
                <Card title='ტოკენების ბალანსი' titleBorder={true}>
                  <div className='bg-lightCard rounded-lg w-full mt-2'>
                    <Tab.Group as='div'>
                      <div className='px-2'>
                        <Tab.List className='flex w-full overflow-y-auto rounded-xl bg-primary p-1 gap-1'>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5 ', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2'>
                              <Avatar src={BSC} alt='' className='w-4' />
                              <p className='font-bold text-white '>BSC</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={ETH} alt='' className='w-3' />
                              <p className='font-bold text-white '>ETH</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={AVAX} alt='' className='w-4' />
                              <p className='font-bold text-white '>AVAX</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={MATIC} alt='' className='w-4' />
                              <p className='font-bold text-white '>MATIC</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={FANTOM} alt='' className='w-3' />
                              <p className='font-bold text-white '>FTM</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={CRONOS} alt='' className='w-4' />
                              <p className='font-bold text-white '>CRO</p>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) => classNames('whitespace-nowrap px-6 py-2 w-full text-white rounded-lg text-sm font-medium leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
                            <div className='flex items-center justify-center gap-2 whitespace-nowrap'>
                              <Avatar src={ARBITRUM} alt='' className='w-4' />
                              <p className='font-bold text-white '>ARB</p>
                            </div>
                          </Tab>
                        </Tab.List>
                      </div>
                      <div className='border-[1px] border-lightBorder mt-2'></div>
                      {active ? (
                        <Tab.Panels>
                          <Tab.Panel>
                            <TokensTable data={bscTokenBalance} networkId={56} isLoading={isLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TokensTable data={ethTokenBalance} networkId={1} isLoading={isLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TokensTable data={avaxTokenBalance} networkId={43114} isLoading={isLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TokensTable data={maticTokenBalance} networkId={137} isLoading={isLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TokensTable data={fantomTokenBalance} networkId={250} isLoading={isLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TokensTable data={cronosTokenBalance} networkId={25} isLoading={isLoading} />
                          </Tab.Panel>
                          <Tab.Panel>
                            <TokensTable data={arbitrumTokenBalance} networkId={42161} isLoading={isLoading} />
                          </Tab.Panel>
                        </Tab.Panels>
                      ) : (
                        <div className='py-5 flex justify-center'>
                          <ConnectButton text='დააკავშირეთ საფულე' />
                        </div>
                      )}
                    </Tab.Group>
                  </div>
                </Card>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  )
}

export default Index
