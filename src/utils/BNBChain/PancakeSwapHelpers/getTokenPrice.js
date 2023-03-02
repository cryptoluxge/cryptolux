import BigNumber from 'bignumber.js'
import { PancakeSwapTokens } from 'config/BNBChain/PancakeSwap/constants/tokens'
import Web3 from 'web3'
import { getBep20TokenContract, getFactoryContract, getLpContract } from './contractHelpers'

const factoryContract = getFactoryContract()

export const getFromWeiTo = (value, decimal) => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const BIG_TEN = new BigNumber(10)
  let number = 0
  if (Number(decimal) === 18) {
    number = web3.utils.fromWei(value, 'ether')
  } else if (Number(decimal) === 8) {
    number = new BigNumber(value).div(BIG_TEN.pow(8))
  } else if (Number(decimal) === 6) {
    number = web3.utils.fromWei(value, 'mwei')
  } else if (Number(decimal) === 9) {
    number = new BigNumber(value).div(BIG_TEN.pow(9))
  } else if (Number(decimal) === 4) {
    number = new BigNumber(value).div(BIG_TEN.pow(4))
  } else if (Number(decimal) === 17) {
    number = new BigNumber(value).div(BIG_TEN.pow(17))
  }
  return number
}

export const getTokenpriceInBNB = async (contractAddress) => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const getBnbPair = await factoryContract.methods.getPair(PancakeSwapTokens.wbnb.contractAddress, contractAddress).call()
  const lpContract = getLpContract(getBnbPair)
  const reserves = await lpContract.methods.getReserves().call()
  const reserveOne = web3.utils.fromWei(reserves[1], 'ether')
  const reserveZero = web3.utils.fromWei(reserves[0], 'ether')
  const tokenPriceinBNB = Number(reserveOne) / Number(reserveZero)
  return tokenPriceinBNB
}

export const getTokenPriceFromBNBToBUSD = async (contractAddress, decimals) => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const bnbPrice = 303
  const getBnbPair = await factoryContract.methods.getPair(PancakeSwapTokens.wbnb.contractAddress, contractAddress).call()
  const lpContract = getLpContract(getBnbPair)
  const reserves = await lpContract.methods.getReserves().call()
  const reserveOne = web3.utils.fromWei(reserves[1], getFromWeiTo(decimals))
  const reserveZero = web3.utils.fromWei(reserves[0], getFromWeiTo(decimals))
  const tokenPriceinBNB = Number(reserveOne) / Number(reserveZero)
  const tokenPriceinUSD = tokenPriceinBNB * Number(bnbPrice)
  return tokenPriceinUSD
}

export const getTokenPriceInBUSD = async (contractAddress) => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const getBusdPair = await factoryContract.methods.getPair(PancakeSwapTokens.busd.contractAddress, contractAddress).call()
  const lpContract = getLpContract(getBusdPair)
  const reserves = await lpContract.methods.getReserves().call()
  const reserveOne = web3.utils.fromWei(reserves[1], 'ether')
  const reserveZero = web3.utils.fromWei(reserves[0], 'ether')
  const tokenPrice = Number(reserveOne) / Number(reserveZero)
  return tokenPrice
}

export const getTokenPriceBSC = async (contractAddress, decimals) => {
  const getBusdPair = await factoryContract.methods.getPair(PancakeSwapTokens.busd.contractAddress, contractAddress).call()
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  if (getBusdPair === '0x0000000000000000000000000000000000000000') {
    const bnbPrice = 303
    const getBnbPair = await factoryContract.methods.getPair(PancakeSwapTokens.wbnb.contractAddress, contractAddress).call()
    const lpContract = getLpContract(getBnbPair)
    const reserves = await lpContract.methods.getReserves().call()
    const reserveOne = web3.utils.fromWei(reserves[1], 'ether')
    const reserveZero = getFromWeiTo(reserves[0], Number(decimals))
    const tokenPriceinBNB = Number(reserveOne) / Number(reserveZero)
    const tokenPriceinUSD = tokenPriceinBNB * Number(bnbPrice)
    return tokenPriceinUSD
  }
  const lpContract = getLpContract(getBusdPair)
  const reserves = await lpContract.methods.getReserves().call()
  const reserveOne = web3.utils.fromWei(reserves[1], 'ether')
  const reserveZero = getFromWeiTo(reserves[0], Number(decimals))
  const tokenPrice = Number(reserveOne) / Number(reserveZero)
  return tokenPrice
}

export const getBusdPrice = async () => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const getBusdUsdPair = getLpContract('0x7EFaEf62fDdCCa950418312c6C91Aef321375A00')
  const reserves = await getBusdUsdPair.methods.getReserves().call()
  const reserveOne = web3.utils.fromWei(reserves[1], 'ether')
  const reserveZero = web3.utils.fromWei(reserves[0], 'ether')
  const price = Number(reserveOne) / Number(reserveZero)
  return price
}

export const getUsdtPrice = async () => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const getBusdUsdPair = getLpContract('0x7EFaEf62fDdCCa950418312c6C91Aef321375A00')
  const reserves = await getBusdUsdPair.methods.getReserves().call()
  const reserveOne = web3.utils.fromWei(reserves[1], 'ether')
  const reserveZero = web3.utils.fromWei(reserves[0], 'ether')
  const price = Number(reserveZero) / Number(reserveOne)
  return price
}

export const getTokenPriceForFarm = async (contractAddress, decimals) => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  if (contractAddress === PancakeSwapTokens.busd.contractAddress) {
    const busdprice = await getBusdPrice()
    return busdprice
  }

  if (contractAddress === PancakeSwapTokens.usdt.contractAddress) {
    const usdtprice = await getUsdtPrice()
    return usdtprice
  }

  if (contractAddress === PancakeSwapTokens.bnb.contractAddress) {
    const bnbPrice = 303
    return bnbPrice
  }

  const getBusdPair = await factoryContract.methods.getPair(PancakeSwapTokens.busd.contractAddress, contractAddress).call()
  const getBnbPair = await factoryContract.methods.getPair(PancakeSwapTokens.wbnb.contractAddress, contractAddress).call()
  const getusdtPair = await factoryContract.methods.getPair(PancakeSwapTokens.usdt.contractAddress, contractAddress).call()

  if (getBusdPair === '0x0000000000000000000000000000000000000000') {
    const bnbPrice = 303
    const lpContract = getLpContract(getBnbPair)
    const reserves = await lpContract.methods.getReserves().call()
    const reserveOne = Number(decimals) === 18 ? web3.utils.fromWei(reserves[1], 'ether') : getFromWeiTo(reserves[1], Number(decimals))
    const reserveZero = Number(decimals) === 18 ? web3.utils.fromWei(reserves[0], 'ether') : getFromWeiTo(reserves[0], Number(decimals))
    const tokenPriceinBNB = Number(reserveOne) / Number(reserveZero)
    const tokenPriceinUSD = tokenPriceinBNB * Number(bnbPrice)
    return tokenPriceinUSD
  }

  if (getBnbPair === '0x0000000000000000000000000000000000000000') {
    const lpContract = getLpContract(getusdtPair)
    const reserves = await lpContract.methods.getReserves().call()
    const reserveOne = Number(decimals) === 18 ? web3.utils.fromWei(reserves[1], 'ether') : getFromWeiTo(reserves[1], Number(decimals))
    const reserveZero = Number(decimals) === 18 ? web3.utils.fromWei(reserves[0], 'ether') : getFromWeiTo(reserves[0], Number(decimals))
    const tokenPrice = Number(reserveOne) / Number(reserveZero)
    return tokenPrice
  }

  const lpContract = getLpContract(getBusdPair)
  const reserves = await lpContract.methods.getReserves().call()
  const token0 = await lpContract.methods.token0().call()
  const token0Contract = getBep20TokenContract(token0)
  const token0Decimal = await token0Contract.methods.decimals().call()

  const token1 = await lpContract.methods.token1().call()
  const token1Contract = getBep20TokenContract(token1)
  const token1Decimal = await token1Contract.methods.decimals().call()

  const reserveZero = Number(token0Decimal) === 18 ? web3.utils.fromWei(reserves[0], 'ether') : getFromWeiTo(reserves[0], Number(token0Decimal))
  const reserveOne = Number(token1Decimal) === 18 ? web3.utils.fromWei(String(reserves[1]), 'ether') : getFromWeiTo(reserves[1], Number(token1Decimal))
  const tokenPrice = Number(reserveOne) / Number(reserveZero)
  return tokenPrice
}
