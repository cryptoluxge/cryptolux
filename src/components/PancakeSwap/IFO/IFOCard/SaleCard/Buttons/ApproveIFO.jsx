import { useWeb3React } from '@web3-react/core'
import Button from 'components/Button'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { getCakeContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'

const ApproveIFO = () => {
  const { account, chainId } = useWeb3React()
  const toast = useToast()
  const cakeContract = getCakeContract(chainId)
  const [isLoading, setIsLoading] = useState(Boolean)

  async function handleApprove() {
    setIsLoading(true)
    await cakeContract.methods
      .approve(ifo[0].poolContract, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
      .send({ from: account, gasLimit: ifo[0].gasLimits.approve })
      .once('transactionHash', (hash) => {
        toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
      })
      .on('error', (error) => {
        if (error.code === 4001) {
          toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
        } else if (error.code === -32003) {
          toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
        } else if (error.code === -32603) {
          toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
        } else {
          toast('error', 'არ დადასტურდა')
        }
        setIsLoading(false)
      })
      .then((receipt) => {
        if (receipt.status === true) {
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `${ifo[0].tokenDetails.name}-ს IFO პულები გააქტიურებულია!`, receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა', '', receipt.transactionHash)
        }
        setIsLoading(false)
      })
  }

  return (
    <div>
      <Button onClick={() => handleApprove()} loading={isLoading}>
        Enable
      </Button>
    </div>
  )
}

export default ApproveIFO
