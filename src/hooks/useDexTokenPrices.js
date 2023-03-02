import CAKEBUSDAbi from '../config/BNBChain/PancakeSwap/abi/cakebusd.json'
import { contract } from '../config/BNBChain/PancakeSwap/constants/contracts'
import Web3 from 'web3'

export const useCakePrice = async () => {
  const web3 = new Web3('https://bsc-dataseed.binance.org')
  const cakebusdpair = new web3.eth.Contract(CAKEBUSDAbi, contract.cakeBusd.contractAddress)
  const getCAKEBUSDReserves = await cakebusdpair.methods.getReserves().call()
  const reserve0 = getCAKEBUSDReserves[0]
  const reserve1 = getCAKEBUSDReserves[1]
  const getCakePrice = Number(web3.utils.fromWei(reserve1, 'ether')) / Number(web3.utils.fromWei(reserve0, 'ether'))
  return getCakePrice
}
