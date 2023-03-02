import { useWeb3React } from '@web3-react/core'
import Button from 'components/Button'
import { useToast } from 'hooks/useToast'
import { getCakeContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'

const ApproveButtons = ({ poolContract, name }) => {
  const toast = useToast()
  const { account, chainId } = useWeb3React()
  const cakeContract = getCakeContract(chainId)

  const handleApprove = async () => {
    await cakeContract.methods
      .approve(poolContract, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
      .send({ from: account, gasLimit: 60000 })
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
      })
      .then((receipt) => {
        if (receipt.status === true) {
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `${name} პული გააქტიურებულია!`, receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა', '', receipt.transactionHash)
        }
      })
  }

  return (
    <div>
      <Button onClick={() => handleApprove()}>Enable</Button>
    </div>
  )
}

export default ApproveButtons
