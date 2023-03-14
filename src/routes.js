import EthereumIcon from 'assets/images/Blockchains/Ethereum.svg'
import Mina from 'assets/images/Blockchains/Mina.svg'
import BitcoinIcon from 'assets/images/Crypto/Bitcoin.svg'
import AddressBookIcon from './assets/images/SidebarIcons/AddressBookIcon.svg'
import AptosIcon from './assets/images/SidebarIcons/AptosIcon.svg'
import ChainIcon from './assets/images/SidebarIcons/BlockchainIcon.svg'
import CardanoIcon from './assets/images/SidebarIcons/CardanoIcon.svg'
import DashboardIcon from './assets/images/SidebarIcons/DashboardIcon.svg'
import MarketIcon from './assets/images/SidebarIcons/MarketIcon.svg'
import PancakeSwapIcon from './assets/images/SidebarIcons/PancakeSwapIcon.svg'
import PortfolioIcon from './assets/images/SidebarIcons/PortfolioIcon.svg'
import ToolsIcon from './assets/images/SidebarIcons/ToolsIcon.svg'
import WalletIcon from './assets/images/SidebarIcons/WalletIcon.svg'
import AirdropIcon from './assets/images/SidebarIcons/AirdropIcon.svg'

export const menuItem = [
  {
    type: 'noncollapsible',
    path: '/',
    key: 'home',
    name: 'მთავარი',
    icon: DashboardIcon,
  },
  {
    type: 'collapsible',
    path: '/wallet',
    key: 'wallet',
    name: 'საფულე',
    icon: WalletIcon,
    collapse: [
      {
        name: 'EVM',
        key: 'evm',
        path: '/wallet/evm',
      },
      {
        name: 'Aptos',
        key: 'aptos',
        path: '/wallet/aptos',
      },
    ],
  },
  {
    type: 'noncollapsible',
    path: '/market',
    key: 'market',
    name: 'მარკეტი',
    icon: MarketIcon,
  },
  {
    type: 'noncollapsible',
    path: '/chains',
    key: 'chains',
    name: 'ქსელები',
    icon: ChainIcon,
  },
  {
    type: 'title',
    key: 'blockchain',
    name: 'Blockchains',
  },
  {
    type: 'collapsible',
    path: '/evm',
    key: 'evm',
    name: 'EVM',
    icon: EthereumIcon,
    collapse: [
      {
        name: 'ბალანსი შემოწმება',
        key: 'wallet',
        path: '/evm/wallet',
      },
      {
        name: 'ტოკენების ბალანსი',
        key: 'token-balance',
        path: '/evm/token-balance',
      },
      {
        name: 'NFT ბალანსი',
        key: 'nft-balance',
        path: '/evm/nft-balance',
      },
    ],
  },
  {
    type: 'collapsible',
    path: '/aptos',
    key: 'aptos',
    name: 'Aptos',
    icon: AptosIcon,
    collapse: [
      {
        name: 'საფულის შემოწმება',
        key: 'wallet',
        path: '/aptos/wallet',
      },
      {
        name: 'APT ბალანსი',
        key: 'balance',
        path: '/aptos/balance',
      },
      {
        name: 'ტოკენების ბალანსი',
        key: 'tokens',
        path: '/aptos/tokens',
      },
      {
        name: 'NFT ბალანსი',
        key: 'nft',
        path: '/aptos/nft',
      },
    ],
  },
  {
    type: 'noncollapsible',
    path: '/cardano',
    key: 'cardano',
    name: 'Cardano',
    icon: CardanoIcon,
  },
  {
    type: 'noncollapsible',
    path: '/mina',
    key: 'mina',
    name: 'Mina',
    icon: Mina,
  },
  {
    type: 'title',
    key: 'title',
    name: 'სხვა',
  },
  {
    type: 'noncollapsible',
    path: '/bitcoin',
    key: 'bitcoin',
    name: 'Bitcoin',
    icon: BitcoinIcon,
  },
  {
    type: 'noncollapsible',
    path: '/airdrops',
    key: 'airdrops',
    name: 'Airdrops',
    icon: AirdropIcon,
  },
  {
    type: 'collapsible',
    path: '/pancakeswap',
    key: 'pancakeswap',
    name: 'PancakeSwap',
    icon: PancakeSwapIcon,
    collapse: [
      {
        name: 'IFO',
        key: 'ifo',
        path: '/pancakeswap/ifo',
      },
    ],
  },
  {
    type: 'collapsible',
    path: '/tool',
    key: 'tool',
    name: 'ხელსაწყოები',
    icon: ToolsIcon,
    collapse: [
      {
        name: 'საფულე',
        key: 'wallet',
        path: '/tool/wallet',
      },
      {
        name: 'Token Approvals',
        key: 'approvals',
        path: '/tool/approvals',
      },
    ],
  },
  {
    type: 'noncollapsible',
    path: '/address-book',
    key: 'address-book',
    name: 'მისამართების წიგნაკი',
    icon: AddressBookIcon,
  },
  {
    type: 'noncollapsible',
    path: '/portfolio',
    key: 'portfolio',
    name: 'პორტფოლიო',
    icon: PortfolioIcon,
  },
]
