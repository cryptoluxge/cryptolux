import axios from 'axios'
import { supportedChains } from 'config'


export const getNativeTransactions = async (walletAddress, chain) => {
  const json = await axios(`https://deep-index.moralis.io/api/v2/${walletAddress}?chain=${chain}`, {
    headers: {
      'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
    },
  })
    .then((response) => response)
    .then((data) => data)
  return json
}

export const getTokenTransactions = async (walletAddress, chain) => {
  const json = await axios(`https://deep-index.moralis.io/api/v2/${walletAddress}/erc20/transfers?chain=${chain}`, {
    headers: {
      'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
    },
  })
    .then((response) => response)
    .then((data) => data)
  return json
}

export const getNftTransactions = async (walletAddress, chain) => {
  const json = await axios(`https://deep-index.moralis.io/api/v2/${walletAddress}/nft/transfers?chain=${chain}&format=decimal&direction=both`, {
    headers: {
      'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
    },
  })
    .then((response) => response)
    .then((data) => data)
  return json
}

export const getTokenBalances = async (walletAddress, chain, atBlockNumber, tokenAddress) => {
  const json = await axios(`https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=${chain}${atBlockNumber ? `&to_block=${atBlockNumber}` : ''}${tokenAddress ? `&token_addresses=${tokenAddress}` : ''}`, {
    headers: {
      'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
    },
  })
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getNftBalances = async (walletAddress, chain) => {
  const json = await axios(`https://deep-index.moralis.io/api/v2/${walletAddress}/nft?chain=${chain}&format=decimal`, {
    headers: {
      'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
    },
  })
    .then((response) => response)
    .then((data) => data)
  return json
}

export const getMultiwalletNativeBalance = async (walletAddresses) => {
  let evmChains = Array(supportedChains)[0].filter((x) => x.chainType === 'evm')
  let finalData = []
  let balances = []
  try {
    for (const wallet of walletAddresses) {
      for (const chain of evmChains) {
        const json = await axios(`https://deep-index.moralis.io/api/v2/${wallet}/balance?chain=${chain.chainIdHex}`, {
          headers: {
            'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
          },
        })
          .then((response) => response)
          .then((data) => data)


        if (json.status === 200) {
          balances.push({ status: 200, chainSymbol: chain.networkSymbol, chainName: chain.networkName, chainLogo: chain.logo, chainId: chain.chainId, balance: Number(json.data.balance) / 10 ** 18 })
        } else {
          balances.push({ status: 404, chainSymbol: chain.networkSymbol, chainName: chain.networkName, chainLogo: chain.logo, chainId: chain.chainId, balance: "API ERROR" })
        }
      }
      finalData.push({ address: wallet, data: balances })
      balances = []
    }
    return finalData
  } catch (error) {
    console.log(error)
  }
}

export const getMultiWalletTokenBalance = async (walletAddresses) => {
  let evmChains = Array(supportedChains)[0].filter((x) => x.chainType === 'evm')
  let finalData = []
  let balances = []
  try {
    for (const wallet of walletAddresses) {
      for (const chain of evmChains) {
        const json = await axios(`https://deep-index.moralis.io/api/v2/${wallet}/erc20?chain=${chain.chainIdHex}`, {
          headers: {
            'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
          },
        })
          .then((response) => response)
          .then((data) => data)

        if (json.status === 200) {
          balances.push({ status: 200, chainSymbol: chain.networkSymbol, chainName: chain.networkName, chainLogo: chain.logo, chainId: chain.chainId, balance: json.data })
        } else {
          balances.push({ status: 404, chainSymbol: chain.networkSymbol, chainName: chain.networkName, chainLogo: chain.logo, chainId: chain.chainId, balance: [] })
        }
      }
      finalData.push({ address: wallet, data: balances })
      balances = []
    }
    return finalData
  } catch (error) {
    console.log(error)
  }
}

export const getMultiWalletNftBalance = async (walletAddresses) => {
  let evmChains = Array(supportedChains)[0].filter((x) => x.chainType === 'evm')
  let finalData = []
  let balances = []
  try {
    for (const wallet of walletAddresses) {
      for (const chain of evmChains) {
        const json = await axios(`https://deep-index.moralis.io/api/v2/${wallet}/nft?chain=${chain.chainIdHex}&format=decimal`, {
          headers: {
            'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
          },
        })
          .then((response) => response)
          .then((data) => data)

        if (json.status === 200) {
          balances.push({ status: 200, chainSymbol: chain.networkSymbol, chainName: chain.networkName, chainLogo: chain.logo, chainId: chain.chainId, balance: json.data })
        } else {
          balances.push({ status: 404, chainSymbol: chain.networkSymbol, chainName: chain.networkName, chainLogo: chain.logo, chainId: chain.chainId, balance: [] })
        }
      }
      finalData.push({ address: wallet, data: balances })
      balances = []
    }
    return finalData
  } catch (error) {
    console.log(error)
  }
}
