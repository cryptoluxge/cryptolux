// კონტრაქტის მისამართები
import { contract } from 'config/BNBChain/constants/contracts'

// კონტრაქტების ABI
import wBNBAbi from 'config/abi/BNBChain/bep20.json'
import bep20Abi from 'config/abi/BNBChain/bep20.json'
import Web3 from 'web3'

const getContract = (abi, address) => {
  const signerOrProvider = window.ethereum
  const web3 = new Web3(signerOrProvider)
  const newContract = new web3.eth.Contract(abi, address)
  return newContract
}

export const getWBNBContract = (chainId) => {
  return getContract(wBNBAbi, contract.wBNB.contractAddress, chainId)
}

export const getBep20TokenContract = (tokenContractAddress, chainId) => {
  return getContract(bep20Abi, tokenContractAddress, chainId)
}
