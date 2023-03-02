import Web3 from 'web3'
import { getFactoryContract, getIfoPoolContract, getLpContract } from './contractHelpers'

const web3 = new Web3('https://bsc-dataseed1.binance.org/')

export const getUserIfoData = async (poolContract, account, isVested, ifoName, tokenDecimals, tokenName, tokenSymbol, tokenLogo, unlockPercent) => {
  const ifoContract = getIfoPoolContract(poolContract)

  const offeringToken = await ifoContract.methods.offeringToken().call()

  //Public Sale Details
  const publicPool = await ifoContract.methods.viewUserOfferingAndRefundingAmountsForPools(account, [1]).call()
  const unspentCakeInPublic = Number(web3.utils.fromWei(publicPool[0][1], 'ether'))
  const receivedInPublic = Number(publicPool[0][0])
  const participatedInPublic = Number(unspentCakeInPublic) > 0 ? true : false
  const getVestedInfoPublic = isVested === true ? await getUserVestingData(1, poolContract, account, tokenDecimals) : { vested: 0, pending: 0 }

  //Private Sale Details
  const privatePool = await ifoContract.methods.viewUserOfferingAndRefundingAmountsForPools(account, [0]).call()
  const unspentCakeInPrivate = Number(web3.utils.fromWei(privatePool[0][1], 'ether'))
  const receivedInPrivate = Number(privatePool[0][0])
  const participatedInPrivate = Number(unspentCakeInPrivate) > 0 ? true : false
  const participated = Number(unspentCakeInPublic) === 0 && Number(unspentCakeInPrivate) === 0 ? false : true
  const getVestedInfoPrivate = isVested === true ? await getUserVestingData(0, poolContract, account, tokenDecimals) : { vested: 0, pending: 0 }

  const userInfo = await ifoContract.methods.viewUserInfo(account, [1, 0]).call()
  const spentInPrivate = Number(web3.utils.fromWei(String(userInfo[0][0])), 'ether') - unspentCakeInPrivate
  const spentInPublic = Number(web3.utils.fromWei(String(userInfo[0][1])), 'ether') - unspentCakeInPublic

  const hasClaimedPublic = userInfo[1][1]
  const hasClaimedPrivate = userInfo[1][0]

  const unlockPercentPublic = (unlockPercent / 100) * (receivedInPublic / 10 ** tokenDecimals)
  const unlockPercentPrivate = (unlockPercent / 100) * (receivedInPrivate / 10 ** tokenDecimals)

  return {
    ifoName,
    participated,
    isVested,
    offeringToken: { contractAddress: offeringToken, decimals: tokenDecimals, name: tokenName, symbol: tokenSymbol, logo: tokenLogo },
    publicSale: {
      deposited: Number(web3.utils.fromWei(String(userInfo[0][1]), 'ether')),
      claimed: hasClaimedPublic,
      spent: spentInPublic,
      unspent: unspentCakeInPublic,
      unlocked: unlockPercentPublic,
      receivedToken: receivedInPublic / 10 ** tokenDecimals,
      participated: participatedInPublic,
      vesting: getVestedInfoPublic,
    },
    privateSale: {
      deposited: Number(web3.utils.fromWei(String(userInfo[0][0])), 'ether'),
      claimed: hasClaimedPrivate,
      spent: spentInPrivate,
      unspent: unspentCakeInPrivate,
      unlocked: unlockPercentPrivate,
      receivedToken: receivedInPrivate / 10 ** tokenDecimals,
      participated: participatedInPrivate,
      vesting: getVestedInfoPrivate,
    },
  }
}

export const getUserVestingData = async (pid, poolContract, account, tokenDecimals) => {
  const ifoContract = getIfoPoolContract(poolContract)
  try {
    const getData = await ifoContract.methods.viewUserOfferingAndRefundingAmountsForPools(account, [pid]).call()

    if (getData[0][0] === '0' && getData[0][1] === '0' && getData[0][2] === '0') {
      return { vested: 0, pending: 0 }
    } else {
      const getVestingScheduleId = await ifoContract.methods.computeVestingScheduleIdForAddressAndPid(account, pid).call()
      const getPendingVestedTokens = await ifoContract.methods.computeReleasableAmount(getVestingScheduleId).call()
      const getVestingSchedule = await ifoContract.methods.getVestingSchedule(getVestingScheduleId).call()
      const formattedVested = Number(getPendingVestedTokens) / 10 ** tokenDecimals
      const totalAmount = Number(getVestingSchedule[3]) / 10 ** tokenDecimals
      const vestedToken = Number(totalAmount) - Number(formattedVested)
      return { vested: vestedToken, pending: formattedVested }
    }
  } catch {
    return { vested: 0, pending: 0 }
  }
}

export const getIfoTokenPrice = async (contractAddress, decimals) => {
  const factoryContract = getFactoryContract()
  const getPairAddress = await factoryContract.methods.getPair(contractAddress, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56').call()
  if (getPairAddress === '0x0000000000000000000000000000000000000000') {
    return 0
  } else {
    const lpContract = getLpContract(getPairAddress)
    const getToken0 = await lpContract.methods.token0().call()
    const getToken1 = await lpContract.methods.token1().call()
    const getData = await lpContract.methods.getReserves().call()
    if (String(getToken0).toLocaleLowerCase() === '0xe9e7cea3dedca5984780bafc599bd69add087d56') {
      const tokenPrice = Number(getData[0]) / 10 ** decimals / Number(web3.utils.fromWei(getData[1], 'ether'))
      return Number(tokenPrice) > 0 ? Number(tokenPrice) : 0
    } else if (String(getToken1).toLocaleLowerCase() === '0xe9e7cea3dedca5984780bafc599bd69add087d56') {
      const tokenPrice = Number(web3.utils.fromWei(getData[1], 'ether')) / (Number(getData[0]) / 10 ** decimals)
      return Number(tokenPrice) > 0 ? Number(tokenPrice) : 0
    } else {
      return 0
    }
  }
}

export const getIfoTokenPool = async (contractAddress, decimals) => {
  const factoryContract = getFactoryContract()
  const getPairAddress = await factoryContract.methods.getPair(contractAddress, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56').call()
  if (getPairAddress === '0x0000000000000000000000000000000000000000') {
    return { pair: false, isAdded: false, price: 0, liquidity: { busd: 0, token: 0 } }
  } else {
    const lpContract = getLpContract(getPairAddress)
    const reserves = await lpContract.methods.getReserves().call()
    const getToken0 = await lpContract.methods.token0().call()
    const getToken1 = await lpContract.methods.token1().call()
    const getData = await lpContract.methods.getReserves().call()
    if (String(getToken0).toLocaleLowerCase() === '0xe9e7cea3dedca5984780bafc599bd69add087d56') {
      const tokenPrice = Number(getData[0]) / 10 ** decimals / Number(web3.utils.fromWei(getData[1], 'ether'))
      return {
        pair: getPairAddress,
        isAdded: true,
        price: Number(tokenPrice) > 0 ? Number(tokenPrice) : 0,
        liquidity: {
          busd: Number(web3.utils.fromWei(reserves[0], 'ether')),
          token: Number(reserves[1]) / 10 ** decimals,
          total: Number(web3.utils.fromWei(reserves[0], 'ether')) + (Number(reserves[1]) / 10 ** decimals) * tokenPrice,
        },
      }
    } else if (String(getToken1).toLocaleLowerCase() === '0xe9e7cea3dedca5984780bafc599bd69add087d56') {
      const tokenPrice = Number(web3.utils.fromWei(getData[1], 'ether')) / (Number(getData[0]) / 10 ** decimals)
      return {
        pair: getPairAddress,
        isAdded: true,
        price: Number(tokenPrice) > 0 ? Number(tokenPrice) : 0,
        liquidity: {
          busd: Number(web3.utils.fromWei(reserves[1], 'ether')),
          token: Number(reserves[0]) / 10 ** decimals,
          total: Number(web3.utils.fromWei(reserves[1], 'ether')) + (Number(reserves[0]) / 10 ** decimals) * tokenPrice,
        },
      }
    } else {
      return { pair: getPairAddress, isAdded: false, price: 0, liquidity: { busd: 0, token: 0 } }
    }
  }
}
