// ტოკენები
import { PancakeSwapTokens } from 'config/BNBChain/PancakeSwap/constants/tokens'

// კონტრაქტის მისამართები
import { contract } from 'config/BNBChain/PancakeSwap/constants/contracts'

// კონტრაქტების ABI
import bep20Abi from 'config/abi/BNBChain/bep20.json'
import autoCakePoolAbi from 'config/BNBChain/PancakeSwap/abi/autoCakePoolAbi.json'
import CakeTokenAbi from 'config/BNBChain/PancakeSwap/abi/cakeTokenAbi.json'
import cakeVaultV2Abi from 'config/BNBChain/PancakeSwap/abi/cakeVaultV2Abi.json'
import cIFOAbi from 'config/BNBChain/PancakeSwap/abi/cIFOAbi.json'
import factoryAbi from 'config/BNBChain/PancakeSwap/abi/factoryAbi.json'
import ifoCakePoolAbi from 'config/BNBChain/PancakeSwap/abi/ifoCakePoolAbi.json'
import ifoV3Abi from 'config/BNBChain/PancakeSwap/abi/ifoV3Abi.json'
import lotteryAbi from 'config/BNBChain/PancakeSwap/abi/lotteryAbi.json'
import lpContractAbi from 'config/BNBChain/PancakeSwap/abi/lpContractAbi.json'
import manualCakePoolAbi from 'config/BNBChain/PancakeSwap/abi/manualCakePoolAbi.json'
import masterChefV2Abi from 'config/BNBChain/PancakeSwap/abi/masterChefV2Abi.json'
import NFTMarketAbi from 'config/BNBChain/PancakeSwap/abi/nftmarketAbi.json'
import pancakeBunnyAbi from 'config/BNBChain/PancakeSwap/abi/pancakeBunnyAbi.json'
import pancakeProfileAbi from 'config/BNBChain/PancakeSwap/abi/pancakeProfileAbi.json'
import pancakeSquadAbi from 'config/BNBChain/PancakeSwap/abi/pancakeSquadAbi.json'
import pcsRouterAbi from 'config/BNBChain/PancakeSwap/abi/pcsRouterAbi.json'
import syrupPoolAbi from 'config/BNBChain/PancakeSwap/abi/syrupPoolAbi.json'
import Web3 from 'web3'

const getContract = (abi, address, chainId) => {
  const signerOrProvider = chainId === 56 ? window.ethereum : 'https://bsc-dataseed.binance.org'
  const web3 = new Web3(signerOrProvider)
  const newContract = new web3.eth.Contract(abi, address)
  return newContract
}

export const getCakeContract = (chainId) => {
  return getContract(CakeTokenAbi, PancakeSwapTokens.cake.contractAddress, chainId)
}

export const getLpContract = (lpAddresss, chainId) => {
  return getContract(lpContractAbi, lpAddresss, chainId)
}

export const getAutoCakeContract = (chainId) => {
  return getContract(autoCakePoolAbi, contract.cakeVault.contractAddress, chainId)
}

export const getManualCakeContract = (chainId) => {
  return getContract(manualCakePoolAbi, contract.masterChef.contractAddress, chainId)
}

export const getIfoPoolContract = (contractAddress, chainId) => {
  return getContract(ifoV3Abi, contractAddress, chainId)
}

export const getcIfoPoolContract = (contractAddress, chainId) => {
  return getContract(cIFOAbi, contractAddress, chainId)
}

export const getIfoCakePoolContract = (chainId) => {
  return getContract(ifoCakePoolAbi, contract.ifoPool.contractAddress, chainId)
}

export const getSyrupPoolContract = (contractAddress, chainId) => {
  return getContract(syrupPoolAbi, contractAddress, chainId)
}

export const getPancakeProfileContract = (chainId) => {
  return getContract(pancakeProfileAbi, contract.pancakeProfile.contractAddress, chainId)
}

export const getPancakeSquadContract = (chainId) => {
  return getContract(pancakeSquadAbi, contract.pancakeSquad.contractAddress, chainId)
}

export const getPancakeBunnyContract = (chainId) => {
  return getContract(pancakeBunnyAbi, contract.pancakeRabbits.contractAddress, chainId)
}

export const getBep20TokenContract = (tokenContractAddress, chainId) => {
  return getContract(bep20Abi, tokenContractAddress, chainId)
}

export const getSwapContract = (chainId) => {
  return getContract(pcsRouterAbi, contract.router.contractAddress, chainId)
}

export const getFactoryContract = (chainId) => {
  return getContract(factoryAbi, contract.factory.contractAddress, chainId)
}

export const getCakeVaultV2 = (chainId) => {
  return getContract(cakeVaultV2Abi, contract.cakeVaultV2.contractAddress, chainId)
}

export const getMasterChefV2 = (chainId) => {
  return getContract(masterChefV2Abi, contract.masterChefV2.contractAddress, chainId)
}

export const getNFTMarket = (chainId) => {
  return getContract(NFTMarketAbi, contract.NFTMarket.contractAddress, chainId)
}

export const getLotteryContract = (chainId) => {
  return getContract(lotteryAbi, contract.lottery.contractAddress, chainId)
}
