import moment from 'moment'
import { checkAddressExists, checkAddressResource, checkTokenStore, convertNameToAddress } from 'utils/APIs/AptosAPI'
import { shortAddress } from 'utils/WalletHelpers'

export const getAddressInfo = async (walletAddress, data) => {
  const isCoin = data.hasOwnProperty('coin_type') ? true : false
  const isValidAddr = /^(0[xX])?[a-fA-F0-9]{1,64}$/.test(walletAddress)
  if (isValidAddr) {
    const isExists = await checkAddressExists(walletAddress)
    const hasResource = isCoin ? await checkAddressResource(walletAddress, data.coin_type) : await checkTokenStore(walletAddress)
    return { isValidAddr, isExists, isCoin, hasResource }
  }
}

export const getWalletResult = (walletAddress, addressData, data, isDomain) => {
  if (!addressData.isValidAddr) {
    return { isDomain: isDomain, status: 'error', type: 'address', error: 'Invalid address', walletAddress: walletAddress }
  }

  if (!addressData.isExists) {
    if (addressData.isCoin === true && data.coin_type === '0x1::aptos_coin::AptosCoin') {
      return { isDomain: isDomain, status: 'warning', type: 'address', error: 'Account not found but will be created' }
    } else {
      return { isDomain: isDomain, status: 'error', type: 'address', error: 'Account not found', walletAddress: walletAddress }
    }
  }

  if (addressData.isCoin) {
    if (addressData.hasResource.isError === false) {
      const tokenBalance = addressData.hasResource.balance !== 0 ? addressData.hasResource.balance / 10 ** data.coin_info.decimals : 0
      return {
        isDomain: isDomain,
        status: 'success',
        type: 'address',
        walletAddress: walletAddress,
        tokenBalance: tokenBalance,
      }
    } else {
      return {
        isDomain: isDomain,
        status: 'error',
        type: 'address',
        error: `The recipient needs to have a ${String(data.coin_info.symbol).toUpperCase()} account to be able to receive this transaction.`,
      }
    }
  } else {
    if (addressData.hasResource === true) {
      return { isDomain: isDomain, status: 'success', type: 'address', walletAddress: walletAddress }
    } else {
      return {
        isDomain: isDomain,
        status: 'error',
        type: 'address',
        error: 'The recipient did not initialize an 0x3::token::TokenStore account in their wallet.',
        walletAddress: walletAddress,
      }
    }
  }
}

export const checkAddress = async (walletAddress, data) => {
  if (!String(walletAddress).endsWith('.apt')) {
    const AddressData = await getAddressInfo(walletAddress, data)
    const result = getWalletResult(walletAddress, AddressData, data)
    return result
  } else {
    const getAddress = await convertNameToAddress(walletAddress)
    if (getAddress.status) {
      const AddressData = await getAddressInfo(getAddress.address, data)
      const result = getWalletResult(getAddress.address, AddressData, data, String(walletAddress).endsWith('.apt'))
      return result
    }
  }
}

export const isValidAddress = (walletAddress) => {
  return /^(0[xX])?[a-fA-F0-9]{1,64}$/.test(walletAddress) && walletAddress.startsWith('0x') && walletAddress.length >= 64
}

export const shortCoinType = (type) => {
  const getAddress = String(type).split('::')
  const result = `${shortAddress(getAddress[0], 5)}::${getAddress[1]}::${getAddress[2]}`
  return result
}

export const formatTimestamp = (timestamp) => {
  const result = String(timestamp).replace('T', ' ')
  return result
}

export const convertTimestampToDate = (timestamp) => {
  try {
    const date = moment(Number(timestamp) / 1000)
    return date.format('DD/MM/YYYY hh:mm')
  } catch {
    return '-'
  }
}
