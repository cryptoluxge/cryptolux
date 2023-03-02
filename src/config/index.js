import BSC from 'assets/images/Blockchains/Binance.svg'
import ETH from 'assets/images/Blockchains/Ethereum.svg'
import AVAX from 'assets/images/Blockchains/Avalanche.svg'
import Polygon from 'assets/images/Blockchains/Matic.svg'
import Fantom from 'assets/images/Blockchains/Fantom.svg'
import Arbitrum from 'assets/images/Blockchains/Arbitrum.svg'
import Cronos from 'assets/images/Blockchains/Cronos.svg'
import Aptos from 'assets/images/SidebarIcons/AptosIcon.svg'

export const APTOS_INDEXER = 'https://indexer.mainnet.aptoslabs.com/v1/graphql'

export const APTOS_MAINNET_NODE_URL = 'https://fullnode.mainnet.aptoslabs.com/v1'

export const supportedChains = [
  {
    chainType: 'evm',
    networkName: 'Smart Chain',
    networkSymbol: 'BSC',
    moralisId: 'bsc',
    coinName: 'BNB',
    tokenProtocol: 'BEP20',
    chainId: 56,
    chainIdHex: '0x38',
    wrappedTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    coingeckoId: 'binancecoin',
    coingeckoPlatformId: 'binance-smart-chain',
    logo: BSC,
    logoSize: 'w-4',
  },
  {
    chainType: 'evm',
    networkName: 'Ethereum',
    networkSymbol: 'ETH',
    moralisId: 'eth',
    coinName: 'ETH',
    tokenProtocol: 'ERC20',
    chainId: 1,
    chainIdHex: '0x1',
    wrappedTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    coingeckoId: 'ethereum',
    coingeckoPlatformId: 'ethereum',
    logo: ETH,
    logoSize: 'w-3',
  },
  {
    chainType: 'evm',
    networkName: 'Avalanche',
    networkSymbol: 'AVAX',
    moralisId: 'avalanche',
    coinName: 'AVAX',
    tokenProtocol: 'ERC20',
    chainId: 43114,
    chainIdHex: '0xa86a',
    wrappedTokenAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    coingeckoId: 'avalanche-2',
    coingeckoPlatformId: 'avalanche',
    logo: AVAX,
    logoSize: 'w-4',
  },
  {
    chainType: 'evm',
    networkName: 'Polygon',
    networkSymbol: 'MATIC',
    moralisId: 'polygon',
    coinName: 'MATIC',
    tokenProtocol: 'ERC20',
    chainId: 137,
    chainIdHex: '0x89',
    wrappedTokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    coingeckoId: 'matic-network',
    coingeckoPlatformId: 'polygon-pos',
    logo: Polygon,
    logoSize: 'w-4',
  },
  {
    chainType: 'evm',
    networkName: 'Fantom',
    networkSymbol: 'FTM',
    moralisId: 'fantom',
    coinName: 'FTM',
    tokenProtocol: 'ERC20',
    chainId: 250,
    chainIdHex: '0xfa',
    wrappedTokenAddress: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    coingeckoId: 'fantom',
    coingeckoPlatformId: 'fantom',
    logo: Fantom,
    logoSize: 'w-3',
  },
  {
    chainType: 'evm',
    networkName: 'Cronos',
    networkSymbol: 'CRO',
    moralisId: 'cronos',
    coinName: 'CRO',
    tokenProtocol: 'CRC20',
    chainId: 25,
    chainIdHex: '0x19',
    wrappedTokenAddress: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
    coingeckoId: 'crypto-com-chain',
    coingeckoPlatformId: 'cronos',
    logo: Cronos,
    logoSize: 'w-4',
  },
  {
    chainType: 'evm',
    networkName: 'Arbitrum',
    networkSymbol: 'ARB',
    moralisId: 'arbitrum',
    coinName: 'ETH',
    tokenProtocol: 'ERC20',
    chainId: 42161,
    chainIdHex: '0xa4b1',
    wrappedTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    coingeckoId: 'ethereum',
    coingeckoPlatformId: 'arbitrum-one',
    logo: Arbitrum,
    logoSize: 'w-4',
  },
  {
    chainType: 'l1',
    networkName: 'Aptos',
    networkSymbol: 'APT',
    moralisId: '',
    coinName: 'APTOS',
    tokenProtocol: '',
    chainId: 0,
    chainIdHex: '',
    wrappedTokenAddress: '',
    coingeckoId: 'aptos',
    coingeckoPlatformId: 'aptos',
    logo: Aptos,
    logoSize: 'w-4',
  },
  {
    chainType: 'l1',
    networkName: 'Cardano',
    networkSymbol: 'ADA',
    moralisId: '',
    coinName: 'ADA',
    tokenProtocol: '',
    chainId: 0,
    chainIdHex: '',
    wrappedTokenAddress: '',
    coingeckoId: 'cardano',
    coingeckoPlatformId: 'ada',
    logo: Aptos,
    logoSize: 'w-4',
  },
  {
    chainType: 'l1',
    networkName: 'Mina',
    networkSymbol: 'MINA',
    moralisId: '',
    coinName: 'mina',
    tokenProtocol: '',
    chainId: 0,
    chainIdHex: '',
    wrappedTokenAddress: '',
    coingeckoId: 'mina-protocol',
    coingeckoPlatformId: 'mina',
    logo: Aptos,
    logoSize: 'w-4',
  },
]

export const supportedChainsList = {
  ETH: {
    chainType: 'evm',
    networkName: 'Ethereum',
    networkSymbol: 'ETH',
    coinName: 'ETH',
    tokenProtocol: 'ERC20',
    chainId: 1,
    chainIdHex: '0x1',
    wrappedTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    coingeckoId: 'ethereum',
    coingeckoPlatformId: 'ethereum',
    logo: ETH,
    logoSize: 'w-3',
  },
  BSC: {
    chainType: 'evm',
    networkName: 'Smart Chain',
    networkSymbol: 'BSC',
    coinName: 'BNB',
    tokenProtocol: 'BEP20',
    chainId: 56,
    chainIdHex: '0x38',
    wrappedTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    coingeckoId: 'binancecoin',
    coingeckoPlatformId: 'binance-smart-chain',
    logo: BSC,
    logoSize: 'w-4',
  },
  MATIC: {
    chainType: 'evm',
    networkName: 'Polygon',
    networkSymbol: 'MATIC',
    coinName: 'MATIC',
    tokenProtocol: 'ERC20',
    chainId: 137,
    chainIdHex: '0x89',
    wrappedTokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    coingeckoId: 'matic-network',
    coingeckoPlatformId: 'polygon-pos',
    logo: Polygon,
    logoSize: 'w-4',
  },
  AVAX: {
    chainType: 'evm',
    networkName: 'Avalanche',
    networkSymbol: 'AVAX',
    coinName: 'AVAX',
    tokenProtocol: 'ERC20',
    chainId: 43114,
    chainIdHex: '0xa86a',
    wrappedTokenAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    coingeckoId: 'avalanche-2',
    coingeckoPlatformId: 'avalanche',
    logo: AVAX,
    logoSize: 'w-4',
  },
  FTM: {
    chainType: 'evm',
    networkName: 'Fantom',
    networkSymbol: 'FTM',
    coinName: 'FTM',
    tokenProtocol: 'ERC20',
    chainId: 250,
    chainIdHex: '0xfa',
    wrappedTokenAddress: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    coingeckoId: 'fantom',
    coingeckoPlatformId: 'fantom',
    logo: Fantom,
    logoSize: 'w-3',
  },
  CRO: {
    chainType: 'evm',
    networkName: 'Cronos',
    networkSymbol: 'CRO',
    coinName: 'CRO',
    tokenProtocol: 'CRC20',
    chainId: 25,
    chainIdHex: '0x19',
    wrappedTokenAddress: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
    coingeckoId: 'crypto-com-chain',
    coingeckoPlatformId: 'cronos',
    logo: Cronos,
    logoSize: 'w-4',
  },
  ARB: {
    chainType: 'evm',
    networkName: 'Arbitrum',
    networkSymbol: 'ARB',
    coinName: 'ETH',
    tokenProtocol: 'ERC20',
    chainId: 42161,
    chainIdHex: '0xa4b1',
    wrappedTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    coingeckoId: 'ethereum',
    coingeckoPlatformId: 'arbitrum-one',
    logo: Arbitrum,
    logoSize: 'w-4',
  },
  APT: {
    chainType: 'l1',
    networkName: 'Aptos',
    networkSymbol: 'APT',
    moralisId: '',
    coinName: 'APTOS',
    tokenProtocol: '',
    chainId: 0,
    chainIdHex: '',
    wrappedTokenAddress: '',
    coingeckoId: 'aptos',
    coingeckoPlatformId: 'aptos',
    logo: Aptos,
    logoSize: 'w-4',
  },
  ADA: {
    chainType: 'l1',
    networkName: 'Cardano',
    networkSymbol: 'ADA',
    moralisId: '',
    coinName: 'ADA',
    tokenProtocol: '',
    chainId: 0,
    chainIdHex: '',
    wrappedTokenAddress: '',
    coingeckoId: 'cardano',
    coingeckoPlatformId: 'ada',
    logo: Aptos,
    logoSize: 'w-4',
  },
  MINA: {
    chainType: 'l1',
    networkName: 'Mina',
    networkSymbol: 'MINA',
    moralisId: '',
    coinName: 'MINA',
    tokenProtocol: '',
    chainId: 0,
    chainIdHex: '',
    wrappedTokenAddress: '',
    coingeckoId: 'mina-protocol',
    coingeckoPlatformId: 'mina',
    logo: Aptos,
    logoSize: 'w-4',
  },
}