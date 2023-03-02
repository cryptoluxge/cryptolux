import BigNumber from 'bignumber.js'
import { contract } from 'config/BNBChain/PancakeSwap/constants/contracts'
import moment from 'moment'
import Web3 from 'web3'
import { getCakeContract, getCakeVaultV2, getSyrupPoolContract } from './contractHelpers'

const cakeVaultContract = getCakeVaultV2()
const web3 = new Web3('https://bsc-dataseed.binance.org')

function convertTimeStamp(startTimestamp, endTimestamp) {
  /* const daysInGeorgian = { Monday: 'ორშაბათი', Tuesday: 'სამშაბათი', Wednesday: 'ოთხშაბათი', Thursday: 'ხუთშაბათი', Friday: 'პარასკები', Saturday: 'შაბათი', Sunday: 'კვირა' }; */
  const monthsInGeorgian = { January: 'იანვარი', February: 'თებერვალი', March: 'მარტი', April: 'აპრილი', May: 'მაისი', June: 'ივნისი', July: 'ივლისი', August: 'აგვისტო', September: 'სექტემბერი', October: 'ოქტომბერი', December: 'დეკემბერი' }

  const lockStarTimestamp = moment(moment.unix(startTimestamp).format('L'))
  const lockEndTimestamp = moment(moment.unix(endTimestamp).format('L'))

  const total = lockEndTimestamp.diff(lockStarTimestamp, 'week')

  const year = moment.unix(endTimestamp).format('YYYY')
  const month = moment.unix(endTimestamp).format('MMMM')
  const hour = moment.unix(endTimestamp).format('HH')
  const minute = moment.unix(endTimestamp).format('mm')
  const dayNumber = moment.unix(endTimestamp).format('D')
  const date = `${dayNumber} ${monthsInGeorgian[month]}, ${year} ${hour}:${minute}`

  return { total, date }
}

export const getVaultUserData = async (account) => {
  const userInfo = await cakeVaultContract.methods.userInfo(account).call()
  const PricePerFullShare = await cakeVaultContract.methods.getPricePerFullShare().call()
  const depositedCake = web3.utils.fromWei(String(userInfo[2], 'ether'))
  const userShares = web3.utils.fromWei(String(userInfo[0]))
  const pricePerFullShare = web3.utils.fromWei(String(PricePerFullShare))
  const userBoostedShare = web3.utils.fromWei(String(userInfo[6]))
  const cakeIncludingRewards = new BigNumber(userShares).times(new BigNumber(pricePerFullShare)).toNumber()
  const currentCake = new BigNumber(cakeIncludingRewards).minus(new BigNumber(userBoostedShare)).toNumber()
  const pendingCake = new BigNumber(currentCake).minus(new BigNumber(depositedCake)).toNumber()
  const isLocked = userInfo[7]

  if (isLocked) {
    const lockEndTime = convertTimeStamp(userInfo[4], userInfo[5])
    return { depositedCake: depositedCake, cakeAmount: currentCake, pendingAmount: pendingCake, isLocked, lockEndTime }
  }

  return { depositedCake: depositedCake, cakeAmount: currentCake, pendingAmount: pendingCake, isLocked }
}

export const getTotalStakedCake = async () => {
  const totalCakeStaked = await cakeVaultContract.methods.available().call()
  return web3.utils.fromWei(String(totalCakeStaked), 'ether')
}

export const getTotalCakeLocked = async () => {
  const totalLockedCake = await cakeVaultContract.methods.totalLockedAmount().call()
  return web3.utils.fromWei(String(totalLockedCake), 'ether')
}

export const getCakeVaultV2IsApproved = async (account) => {
  const CAKEContract = getCakeContract()
  const isApproved = await CAKEContract.methods.allowance(account, contract.cakeVaultV2.contractAddress).call()
  if (Number(isApproved) > 0) {
    return true
  }
  return false
}

export const getUserCakeBalance = async (account) => {
  const cakeContract = getCakeContract(56)
  const userBalance = await cakeContract.methods.balanceOf(account).call()
  return web3.utils.fromWei(userBalance, 'ether')
}

export const getUserSyrupPoolData = async (poolContract, account, name) => {
  const contract = getSyrupPoolContract(poolContract)
  const cake = getCakeContract()

  const staked = await contract.methods.userInfo(account).call()
  const userStaked = web3.utils.fromWei(staked[0], 'ether')

  const pending = await contract.methods.pendingReward(account).call()
  const userPending = web3.utils.fromWei(pending, 'ether')

  const stakedTotal = await cake.methods.balanceOf(poolContract).call()
  const totalCakeStaked = web3.utils.fromWei(stakedTotal, 'ether')

  const approved = await cake.methods.allowance(account, poolContract).call()
  const isApproved = Number(approved) > 0

  const rewardToken = await contract.methods.rewardToken().call()

  const data = { name, userStaked, userPending, totalCakeStaked, isApproved, poolContract, rewardToken }
  return data
}
