import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Tab } from '@headlessui/react'
import AptosIcon from 'assets/images/SidebarIcons/AptosIcon.svg'
import AptoadsStaking from 'components/Aptos/EcosystemProjects/Aptoads'
import AptosMonkeysJungle from 'components/Aptos/EcosystemProjects/AptosMonkeys'
import BruhBearsTaverns from 'components/Aptos/EcosystemProjects/BruhBears'
import MavrikStaking from 'components/Aptos/EcosystemProjects/Mavrik'
import Card from 'components/Cards/Card'
import MiniCard from 'components/Cards/MiniCard'
import { useEffect, useState } from 'react'
import { BiCoinStack } from 'react-icons/bi'
import { BsImages, BsReceiptCutoff } from 'react-icons/bs'
import { getAPTBalanceForWallets, getNFTsBalanceForWallets, getWalletNFTsCount, getWalletTokensBalance, getWalletTransactionsCount } from 'utils/APIs/AptosAPI'
import { getUserStakedAptoads } from 'utils/Helpers/AptosHelpers/EcosystemProjects/Aptoads'
import { checkJungle } from 'utils/Helpers/AptosHelpers/EcosystemProjects/AptosMonkeys'
import { checkTavern } from 'utils/Helpers/AptosHelpers/EcosystemProjects/BruhTavern'
import { getStakedMavriks } from 'utils/Helpers/AptosHelpers/EcosystemProjects/Mavrik'
import NFTCard from './Tables/NFTTable'
import TokenTable from './Tables/TokenTable'
import Transactions from './Tables/TransactionsTable'
import TotalBalance from './TotalBalance'

const Index = () => {
  const { account } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const [aptBalance, setAPTBalance] = useState([])
  const [tokensBalance, setTokensBalance] = useState([])
  const [tokensBalanceCount, setTokensBalanceCount] = useState('')
  const [nftBalance, setNftBalance] = useState([])
  const [nftBalanceCount, setNftBalanceCount] = useState('')
  const [txsCount, setTxsCount] = useState()
  const [monkeysList, setMonkeyList] = useState([])
  const [bruhList, setBruhList] = useState([])
  const [toadList, setToadList] = useState([])
  const [mavrikList, setMavrikList] = useState([])

  const getWalletData = async () => {
    setIsLoading(true)

    const getAptBalance = await getAPTBalanceForWallets([account.address])
    const getTokenBalances = await getWalletTokensBalance(account.address)
    const getNftsCount = await getWalletNFTsCount(account.address)
    const getNFTsBalance = await getNFTsBalanceForWallets([account.address], 100, 0, getNftsCount?.data?.data?.current_token_ownerships_aggregate?.aggregate?.count)
    const getWalletTxsCount = await getWalletTransactionsCount(account.address)

    const getJungleData = await checkJungle(account.address)
    const getToadsData = await getUserStakedAptoads(account.address)
    const getMavrikData = await getStakedMavriks(account.address)
    const getBruhData = await checkTavern(account.address)

    if (getTokenBalances.status === 200) {
      if (getTokenBalances.data.data.current_coin_balances.length > 0) {
        setTokensBalanceCount(getTokenBalances.data.data.current_coin_balances.length)
      } else {
        setTokensBalanceCount(0)
      }
    } else {
      setTokensBalanceCount('!')
    }

    if (getNftsCount.status === 200) {
      setNftBalanceCount(getNftsCount.data.data.current_token_ownerships_aggregate.aggregate.count)
    } else {
      setNftBalanceCount('!')
    }

    if (getWalletTxsCount.status === 200) {
      setTxsCount(getWalletTxsCount.data.data.move_resources_aggregate.aggregate.count)
    } else {
      setTxsCount('!')
    }

    setAPTBalance(getAptBalance)
    setTokensBalance(getTokenBalances)
    setNftBalance(getNFTsBalance)

    setMonkeyList(getJungleData)
    setToadList(getToadsData)
    setMavrikList(getMavrikData)
    setBruhList(getBruhData)

    setIsLoading(false)
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    getWalletData()
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full'>
        <TotalBalance walletAddress={account.address} aptBalance={aptBalance} nftBalances={nftBalance} tokensBalance={tokensBalance} stakedAptoads={toadList} stakedMonkeys={monkeysList} stakedMavriks={mavrikList} stakedBruhs={bruhList} />
        <MiniCard title='APT ბალანსი' data={aptBalance.status === 200 ? Number(aptBalance.data[0].balance).toLocaleString('en-US') : '!'} isLoading={isLoading} icon={<img src={AptosIcon} alt='Aptos' className='w-7' />} />
        <MiniCard title='ტოკენი' data={tokensBalanceCount} isLoading={isLoading} icon={<BiCoinStack className='text-white text-2xl' />} />
        <MiniCard title='NFT' data={nftBalanceCount} isLoading={isLoading} icon={<BsImages className='text-white text-2xl' />} />
        <MiniCard title='ტრანზაქციები' data={txsCount} isLoading={isLoading} icon={<BsReceiptCutoff className='text-white text-2xl' />} />
      </div>
      <Tab.Group>
        <div className='w-full md:w-[800px] py-2'>
          <Tab.List className='flex flex-col md:flex-row rounded-xl bg-primary p-1 md:space-x-2'>
            <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
              <div className='flex items-center justify-center gap-2'>
                <p className='font-light text-white'>დასტეიკებული NFT</p>
              </div>
            </Tab>
            <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
              <div className='flex items-center justify-center gap-2'>
                <p className='font-light text-white'>ტოკენების ბალანსი</p>
              </div>
            </Tab>
            <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
              <div className='flex items-center justify-center gap-2'>
                <p className='font-light text-white'>NFT ბალანსი</p>
              </div>
            </Tab>
            <Tab className={({ selected }) => classNames('w-full text-white rounded-lg py-1 text-sm leading-5', selected ? 'bg-lightCard' : 'hover:bg-lightCard')}>
              <div className='flex items-center justify-center gap-2'>
                <p className='font-light text-white'>ტრანზაქციები</p>
              </div>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <div className='flex flex-col gap-2'>
                <AptosMonkeysJungle stakedList={monkeysList} />
                <AptoadsStaking stakedList={toadList} />
              </div>
              <div className='flex flex-col gap-2'>
                <BruhBearsTaverns stakedList={bruhList} />
                <MavrikStaking stakedList={mavrikList} />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <Card title='ტოკენების ბალანსი' titleBorder={true}>
              <div>
                <TokenTable data={tokensBalance} isLoading={isLoading} />
              </div>
            </Card>
          </Tab.Panel>
          <Tab.Panel>
            <Card title='NFT ბალანსი' titleBorder={true}>
              <div className=''>
                <NFTCard data={nftBalance} isChecking={false} />
              </div>
            </Card>
          </Tab.Panel>
          <Tab.Panel>
            <Card title='ტრანზაქციები' titleBorder={true}>
              <div className=''>
                <Transactions walletAddress={account.address} />
              </div>
            </Card>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Index
