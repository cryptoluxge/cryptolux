import AddressBook from 'layouts/AddressBook'
import APTAccountChecker from 'layouts/Aptos/AccountChecker'
import APTBalanceChecker from 'layouts/Aptos/APTBalance'
import APTNFTChecker from 'layouts/Aptos/NFTBalance'
import APTTokensChecker from 'layouts/Aptos/TokensBalance'
import Bitcoin from 'layouts/Bitcoin'
import EVMNftBalanceChecker from 'layouts/EVM/NFTBalanceChecker'
import EVMTokenBalanceChecker from 'layouts/EVM/TokenBalanceChecker'
import EVMWalletChecker from 'layouts/EVM/WalletChecker'
import Mina from 'layouts/Mina'
import Portfolio from 'layouts/Portfolio'
import { Route, Routes, useLocation } from 'react-router-dom'
import { menuItem } from 'routes'
import Sidenav from './components/SideNav'
import ToastContainer from './components/Toast/ToastContainer'
import { ToastProvider } from './context/ToastContext'
import AptosWallet from './layouts/Aptos/Portfolio'
import CardanoWallet from './layouts/Cardano/wallet'
import Chains from './layouts/Chains'
import Dashboard from './layouts/Dashboard'
import Market from './layouts/Market'
import IFOPage from './layouts/PancakeSwap/IFO'
import WalletTool from './layouts/Tools/Wallet'
import EVMWallet from './layouts/Wallet'
import TokenApprovals from 'layouts/Tools/TokenApprovals'
import AirdropFarmer from 'layouts/AirdropFarmer'

function App() {
  const location = useLocation()
  const { pathname } = location

  menuItem.forEach((item) => {
    if (item.path === pathname) {
      document.title = `კრიპტოლუქსი - ${item.name}`
    } else if (item.collapse) {
      item.collapse.forEach((subitem) => {
        if (subitem.path === pathname) {
          document.title = `კრიპტოლუქსი - ${subitem.name}`
        }
      })
    }
  })

  return (
    <div className='duration-200 min-h-screen bg-lightBackground'>
      <ToastProvider>
        <ToastContainer />
        <Sidenav>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/chains' element={<Chains />} />
            <Route path='/market' element={<Market />} />
            <Route path='/PancakeSwap/ifo' element={<IFOPage />} />
            <Route path='/wallet/evm' element={<EVMWallet />} />
            <Route path='/wallet/aptos' element={<AptosWallet />} />
            <Route path='/cardano' element={<CardanoWallet />} />
            <Route path='/tool/wallet' element={<WalletTool />} />
            <Route path='/aptos/wallet' element={<APTAccountChecker />} />
            <Route path='/aptos/balance' element={<APTBalanceChecker />} />
            <Route path='/aptos/tokens' element={<APTTokensChecker />} />
            <Route path='/aptos/nft' element={<APTNFTChecker />} />
            <Route path='/address-book' element={<AddressBook />} />
            <Route path='/mina' element={<Mina />} />
            <Route path='/bitcoin' element={<Bitcoin />} />
            <Route path='/evm/wallet' element={<EVMWalletChecker />} />
            <Route path='/evm/token-balance' element={<EVMTokenBalanceChecker />} />
            <Route path='/evm/nft-balance' element={<EVMNftBalanceChecker />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/tool/approvals' element={<TokenApprovals />} />
            <Route path='/airdrops' element={<AirdropFarmer />} />
          </Routes>
        </Sidenav>
      </ToastProvider>
    </div>
  )
}

export default App
