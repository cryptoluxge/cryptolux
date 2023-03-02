import { useWeb3React } from '@web3-react/core'
import Button from 'components/Button'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useToast } from 'hooks/useToast'
import { getIfoPoolContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'

const HarvestTokens = ({ poolType }) => {
  const { account, chainId } = useWeb3React()
  const IFOContract = getIfoPoolContract(ifo[0].poolContract, chainId)
  const toast = useToast()

  async function harvestTokens() {
    await IFOContract.methods
      .harvestPool(poolType)
      .send({ from: account, gasLimit: ifo[0].gasLimits.harvest })
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
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `${ifo[0].tokenDetails.symbol} ტოკენები თქვენს საფულეშია!`, receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა', '', receipt.transactionHash)
        }
      })
  }

  return (
    <div>
      <Button onClick={() => harvestTokens()}>გამოტანა</Button>
    </div>
  )
}

export default HarvestTokens
