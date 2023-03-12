import Web3 from 'web3'

const tokenABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'guy',
        type: 'address',
      },
      {
        name: 'wad',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const getTokenContract = (address, chain, isSigner) => {
  const getRPC = {
    bsc: 'https://bsc-dataseed1.binance.org/',
    eth: 'https://mainnet.infura.io/v3/',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc',
    polygon: 'https://rpc-mainnet.maticvigil.com',
    fantom: 'https://rpc.ftm.tools/',
    cronos: 'https://evm-cronos.crypto.org/',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
  }
  const web3 = new Web3(isSigner === true ? window.ethereum : getRPC[chain])
  const newContract = new web3.eth.Contract(tokenABI, address)
  return newContract
}

export const getTokenMetadata = async (address, chain) => {
  const tokenContract = getTokenContract(address, chain)
  const tokenName = await tokenContract.methods.name().call()
  const tokenSymbol = await tokenContract.methods.symbol().call()
  let tokenDecimals = 0 // initialize to 0

  try {
    tokenDecimals = await tokenContract.methods.decimals().call()
  } catch (error) {
    tokenDecimals = 0
  }

  return { name: tokenName, symbol: tokenSymbol, decimals: tokenDecimals }
}
