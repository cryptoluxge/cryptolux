export const ETHChain = async () => {
  const provider = window.ethereum

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x1',
              chainName: 'Ethereum Mainnet',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.infura.io/v3/'],
              blockExplorerUrls: [`https://etherscan.io/`],
            },
          ],
        })
      } catch (addError) {
        console.log(addError)
      }
    }
    console.log(switchError)
  }
}

export const BNBChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x38',
          chainName: 'BNB Smart Chain Mainnet',
          nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls: ['https://bsc-dataseed1.binance.org/'],
          blockExplorerUrls: [`https://bscscan.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const AvalancheChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xa86a',
          chainName: 'Avalanche C-Chain',
          nativeCurrency: {
            name: 'Avalanache',
            symbol: 'AVAX',
            decimals: 18,
          },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: [`https://cchain.explorer.avax.Chain/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const FantomChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xfa',
          chainName: 'Fantom Opera',
          nativeCurrency: {
            name: 'Fantom',
            symbol: 'FTM',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.ftm.tools/'],
          blockExplorerUrls: [`https://ftmscan.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const OKEXChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x42',
          chainName: 'OKExChain Mainnet',
          nativeCurrency: {
            name: 'OKT',
            symbol: 'OKT',
            decimals: 18,
          },
          rpcUrls: ['https://exchainrpc.okex.org'],
          blockExplorerUrls: [`https://www.oklink.com/okexchain/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const PolygonChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x89',
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'Polygon',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
          blockExplorerUrls: [`https://polygonscan.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const HecoChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x80',
          chainName: 'Heco Chain Mainnet',
          nativeCurrency: {
            name: 'Huobi Token',
            symbol: 'HT',
            decimals: 18,
          },
          rpcUrls: ['https://http-mainnet.hecochain.com/'],
          blockExplorerUrls: [`https://hecoinfo.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const HarmonyChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x63564c40',
          chainName: 'Harmony Mainnet',
          nativeCurrency: {
            name: 'Harmony',
            symbol: 'ONE',
            decimals: 18,
          },
          rpcUrls: ['https://api.harmony.one'],
          blockExplorerUrls: [`https://explorer.harmony.one/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const ArbitrumChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xa4b1',
          chainName: 'Arbitrum Mainnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://arb1.arbitrum.io/rpc'],
          blockExplorerUrls: [`https://arbiscan.io/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const OptimisticETHChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xa',
          chainName: 'Optimistic Mainnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://mainnet.optimism.io/'],
          blockExplorerUrls: [`https://optimistic.etherscan.io/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const HooSmartChainChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x80',
          chainName: 'Hoo Smart Chain',
          nativeCurrency: {
            name: 'Hoo Token',
            symbol: 'HOO',
            decimals: 18,
          },
          rpcUrls: ['https://http-mainnet.hecochain.com/'],
          blockExplorerUrls: [`https://hscscan.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const VelasChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x6a',
          chainName: 'Velas',
          nativeCurrency: {
            name: 'Velas',
            symbol: 'VLX',
            decimals: 18,
          },
          rpcUrls: ['https://evmexplorer.velas.com/rpc'],
          blockExplorerUrls: [`https://evmexplorer.velas.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const MilkomedaChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x7d1',
          chainName: 'Milkomeda C1',
          nativeCurrency: {
            name: 'wADA',
            symbol: 'wADA',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mainnet-cardano-evm.c1.milkomeda.com'],
          blockExplorerUrls: [`https://explorer-mainnet-cardano-evm.c1.milkomeda.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const CronosChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x19',
          chainName: 'Cronos',
          nativeCurrency: {
            name: 'CRO',
            symbol: 'CRO',
            decimals: 18,
          },
          rpcUrls: ['https://evm-cronos.crypto.org/'],
          blockExplorerUrls: [`https://cronoscan.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const BSCTestnetChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x61',
          chainName: 'BSC Testnet',
          nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'tBNB',
            decimals: 18,
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: [`https://testnet.bscscan.com`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const PolygonMumbaiChain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x13881',
          chainName: 'Mumbai',
          nativeCurrency: {
            name: 'Polygon',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
          blockExplorerUrls: [`https://mumbai.polygonscan.com/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const ShardeumLiberty1Chain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x1f90',
          chainName: 'Shardeum Liberty 1.5',
          nativeCurrency: {
            name: 'Shardeum',
            symbol: 'SHM',
            decimals: 18,
          },
          rpcUrls: ['https://liberty10.shardeum.org/'],
          blockExplorerUrls: [`https://explorer-liberty10.shardeum.org`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const ShardeumLiberty2Chain = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x1f91',
          chainName: 'Shardeum Liberty 2.0',
          nativeCurrency: {
            name: 'Shardeum',
            symbol: 'SHM',
            decimals: 18,
          },
          rpcUrls: ['https://liberty20.shardeum.org/'],
          blockExplorerUrls: [`https://explorer-liberty20.shardeum.org`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}

export const ShardeumSphinx1 = async () => {
  const provider = window.ethereum
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x1f92',
          chainName: 'Shardeum Sphinx 1.X',
          nativeCurrency: {
            name: 'Shardeum',
            symbol: 'SHM',
            decimals: 18,
          },
          rpcUrls: ['https://sphinx.shardeum.org/'],
          blockExplorerUrls: [`https://explorer-sphinx.shardeum.org/`],
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }
}
