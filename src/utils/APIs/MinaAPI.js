import axios from 'axios'

export const getAccount = async (walletAddress) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/widgets/get-balance-chart?size=small&period=30D&countEpoch=0&pk=${walletAddress}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getAccountTxsCount = async (walletAddress, type) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/widgets/get-${type}-transactions?size=small&period=30D&countEpoch=0&pk=${walletAddress}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getAccountTxs = async (walletAddress) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/core/accounts/${walletAddress}/activity?limit=50&orderBy=DESC&page=0&pk=${walletAddress}&sortBy=age&searchStr=&direction=all`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getHasStaking = async (walletAddress) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/core/accounts/${walletAddress}/has-staking`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getDelegatee = async (walletAddress) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/core/accounts/${walletAddress}/delegatee`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getStakingData = async (walletAddress) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/delegations/account-staking/${walletAddress}?limit=50&orderBy=ASC&page=0&pk=${walletAddress}&sortBy=age&searchStr=`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getStakingFullData = async (walletAddress, hash, epoch) => {
  const json = await axios(`https://minascan.io/mainnet/api/api/delegations/staking/${walletAddress}/${epoch}/${hash}?limit=50&orderBy=DESC&page=0&sortBy=epoch`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}
