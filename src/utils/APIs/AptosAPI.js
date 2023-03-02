import axios from 'axios'
import { APTOS_INDEXER } from 'config'

export const getWalletAPTBalance = async (walletAddress) => {
  const data = JSON.stringify({
    query: `query MyQuery($owner_address: String) {
      current_coin_balances(
        where: {owner_address: {_eq: $owner_address}, coin_type: {_eq: "0x1::aptos_coin::AptosCoin"}}
      ) {
        amount
        coin_info {
          name
          decimals
          coin_type
          symbol
        }
      }
    }`,
    variables: { owner_address: walletAddress },
  })

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getAPTBalanceForWallets = async (walletAddress) => {
  let balanceList = []
  await Promise.all(
    walletAddress.map(async (x) => {
      const getBalance = await getWalletAPTBalance(x)
      if (getBalance.status === 200) {
        if (getBalance.data.data && getBalance.data.data.current_coin_balances && Object.keys(getBalance.data.data.current_coin_balances).length > 0) {
          balanceList.push({ address: x, balance: Number(getBalance.data.data.current_coin_balances[0].amount) / 10 ** 8 })
        } else {
          balanceList.push({ address: x, balance: 0 })
        }
      } else {
        return { status: 404, statusCode: 'error', errorText: 'API connection failed! try again!' }
      }
    })
  )
  return { status: 200, statusCode: 'success', data: balanceList.sort((a, b) => b.balance - a.balance) }
}

export const getWalletTokensBalance = async (walletAddress, greaterThen) => {
  var data = null
  if (greaterThen === 0) {
    data = JSON.stringify({
      query: `query MyQuery($owner_address: String, $amount: numeric) {
        current_coin_balances(
          where: {owner_address: {_eq: $owner_address}, amount: {_gt: $amount}}
        ) {
          coin_info {
            coin_type
            coin_type_hash
            decimals
            name
            symbol
          }
          amount
          coin_type
          coin_type_hash
        }
      }`,
      variables: { owner_address: walletAddress, amount: greaterThen },
    })
  } else {
    data = JSON.stringify({
      query: `query MyQuery($owner_address: String) {
        current_coin_balances(where: {owner_address: {_eq: $owner_address}}) {
          coin_info {
            coin_type
            coin_type_hash
            decimals
            name
            symbol
          }
          amount
          coin_type
          coin_type_hash
        }
      }`,
      variables: { owner_address: walletAddress },
    })
  }

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getTokenBalanceForWallets = async (walletAddress, greaterThen) => {
  try {
    let tokenList = []
    for (const wallet of walletAddress) {
      const getTokenBalances = await getWalletTokensBalance(wallet, greaterThen)
      if (getTokenBalances.status === 200 && getTokenBalances.data.data.current_coin_balances.length > 0) {
        const tokenData = getTokenBalances.data.data.current_coin_balances.map((token) => {
          return {
            name: token.coin_info.name,
            symbol: token.coin_info.symbol,
            decimals: token.coin_info.decimals,
            balance: Number(token.amount) / 10 ** token.coin_info.decimals,
          }
        })

        tokenList.push({ address: wallet, data: tokenData })
      }
    }
    return { status: 200, statusCode: 'success', data: tokenList }
  } catch (error) {
    return { status: 400, statusCode: 'error', data: error }
  }
}

export const getWalletNFTsCount = async (walletAddress) => {
  const data = JSON.stringify({
    query: `query userNftBalanceCount($wallet_address: String) {
      current_token_ownerships_aggregate(
        where: {owner_address: {_eq: $wallet_address}, amount: {_gt: "0"}}
      ) {
        aggregate {
          count
        }
      }
    }
    `,
    variables: { wallet_address: walletAddress },
  })

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getNfts = async (walletAddress, limit, offset) => {
  const data = JSON.stringify({
    query: `query MyQuery($address: String, $limit: Int, $offset: Int) {
      current_token_ownerships(
        where: {owner_address: {_eq: $address}, amount: {_gt: "0"}, table_type: {_eq: "0x3::token::TokenStore"}}
        limit: $limit
        offset: $offset
        order_by: {collection_name: asc}
      ) {
        current_token_data {
          metadata_uri
          description
          creator_address
          collection_name
          name
          supply
          last_transaction_timestamp
          last_transaction_version
          royalty_points_numerator
          royalty_points_denominator
          royalty_mutable
          default_properties
        }
        property_version
        amount
        table_type
      }
    } `,
    variables: { address: walletAddress, limit: limit, offset: offset },
  })

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getNFTsBalanceForWallets = async (walletAddresses) => {
  let walletData = []

  for (const address of walletAddresses) {
    const totalNftsForWallet = await getWalletNFTsCount(address)
    if (totalNftsForWallet.status === 200) {
      walletData.push({
        address,
        count: totalNftsForWallet?.data?.data?.current_token_ownerships_aggregate?.aggregate?.count,
      })
    }
  }

  let finalData = []

  for (const wallet of walletData) {
    let offsetNum = 0
    let totalNFTList = []
    if (wallet.count === 0) {
      finalData.push({ address: wallet.address, count: wallet.count, data: [] })
    } else if (wallet.count <= 100) {
      const nfts = await getNfts(wallet.address, 100, 0)
      if (nfts.status === 200 && nfts.data.data.current_token_ownerships.length > 0) {
        finalData.push({ address: wallet.address, count: wallet.count, data: nfts.data.data.current_token_ownerships })
      }
    } else {
      do {
        const nfts = await getNfts(wallet.address, 100, offsetNum)
        if (nfts.status === 200) {
          totalNFTList = totalNFTList.concat(nfts.data.data.current_token_ownerships)
        }
        offsetNum += 100
      } while (offsetNum <= wallet.count)
      finalData.push({ address: wallet.address, count: wallet.count, data: totalNFTList })
    }
  }

  finalData.sort((a, b) => b.data.length - a.data.length)
  return { status: 200, data: finalData }
}

export const getWalletTransactionsCount = async (walletAddress) => {
  const data = JSON.stringify({
    query: `query AccountTransactionsCount($address: String) {
      move_resources_aggregate(
        where: {address: {_eq: $address}}
        distinct_on: transaction_version
      ) {
        aggregate {
          count
          __typename
        }
        __typename
      }
    }`,
    variables: { address: walletAddress },
  })

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getWalletTransactionsVersions = async (walletAddress, limit, offset) => {
  const data = JSON.stringify({
    query: `query UserTransactions($address: String, $limit: Int, $offset: Int) {
      move_resources_aggregate(
        distinct_on: transaction_version
        where: {address: {_eq: $address}}
      ) {
        aggregate {
          count
        }
      }
      move_resources(
        where: {address: {_eq: $address}}
        order_by: {transaction_version: desc}
        distinct_on: transaction_version
        limit: $limit
        offset: $offset
      ) {
        transaction_version
      }}`,
    variables: { address: walletAddress, limit: limit, offset: offset },
  })

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getTransactionByVersion = async (version) => {
  const json = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/transactions/by_version/${version}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getUserTransactions = async (walletAddress, limit, offset) => {
  const txVersions = await getWalletTransactionsVersions(walletAddress, limit, offset)
  var mazafakas = []
  if (Object.keys(txVersions).length > 0 && txVersions.status === 200) {
    if (txVersions.data.data.move_resources.length > 0) {
      mazafakas = []
      await Promise.all(
        txVersions.data.data.move_resources.map(async (x) => {
          const getTx = await getTransactionByVersion(x.transaction_version)
          if (getTx.status === 200) {
            mazafakas.push(getTx.data)
          }
        })
      )
    }
  }
  mazafakas.sort((a, b) => b.version - a.version)
  return mazafakas
}

export const checkAccountData = async (walletAddresses) => {
  let accountsData = []

  for (const account of walletAddresses) {
    const getAptBalance = await getAPTBalanceForWallets(Array(account))
    const getTokensBalance = await getTokenBalanceForWallets(Array(account))
    const getNftsBalance = await getNFTsBalanceForWallets(Array(account))
    accountsData.push({ address: account, data: { getAptBalance, getTokensBalance, getNftsBalance } })
  }
  accountsData.sort((a, b) => b.data.getAptBalance.data[0].balance - a.data.getAptBalance.data[0].balance)
  return accountsData
}

export const checkAddressExists = async (walletAddress) => {
  const json = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${walletAddress}/resources`)
    .then((response) => response)
    .catch((error) => error.response)
  return json.status === 200 && !json.data.hasOwnProperty('error_code') && json.data[0].type === '0x1::account::Account'
}

export const checkAddressResource = async (walletAddress, resource) => {
  const json = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${walletAddress}/resource/0x1::coin::CoinStore<${resource}>`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200 && !json.data.hasOwnProperty('error_code')) {
    return { isError: false, balance: json.data.data.coin.value }
  } else {
    return { isError: true, balance: 0 }
  }
}

export const checkTokenStore = async (walletAddress) => {
  const json = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${walletAddress}/resource/0x3::token::TokenStore`)
    .then((response) => response)
    .catch((error) => error.response)
  return json.status === 200 && json.data.type === '0x3::token::TokenStore'
}

export const convertNameToAddress = async (name) => {
  const json = await axios(`https://www.aptosnames.com/api/mainnet/v1/address/${String(name).replace('.apt', '')}`)
    .then((response) => response)
    .catch((error) => error.response)
  return { status: json.status === 200, address: json.status === 200 ? json.data.address : null }
}

export const convertAddressToName = async (walletAddress) => {
  const json = await axios(`https://www.aptosnames.com/api/mainnet/v1/name/${walletAddress}`)
    .then((response) => response)
    .catch((error) => error.response)
  return { status: json.status === 200, name: json.status === 200 ? json.data.name : null }
}