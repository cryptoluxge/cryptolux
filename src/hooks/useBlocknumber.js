import { useState, useEffect } from 'react'
import Web3 from 'web3'

const useBlockNumber = () => {
  const [blockNumber, setBlockNumber] = useState(Number)
  const web3 = new Web3('https://bsc-dataseed.binance.org')

  useEffect(() => {
    const timer = setInterval(async () => {
      const bn = await web3.eth.getBlockNumber()
      setBlockNumber(Number(bn))
    }, 3000)
    return () => clearInterval(timer)
    // eslint-disable-next-line
  }, [])

  return [blockNumber]
}

export default useBlockNumber
