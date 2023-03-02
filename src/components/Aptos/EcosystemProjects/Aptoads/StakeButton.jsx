import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import Button from 'components/Button'
import { APTOS_MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'

const StakeButton = ({ data }) => {
  const { signAndSubmitTransaction } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const aptosClient = new AptosClient(APTOS_MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const stakeToad = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::user_stake_tokens',
      type_arguments: ['0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::FlyCoin'],
      arguments: ['0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115', [data], 'Aptos Toad Overload'],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'Transaction Confirmd', `You have successfully staked ${data}`, response.hash)
      } else {
        toast('error', '', txResult.success, response.hash)
      }
    } catch (error) {
      if (error === 'The user rejected the request') {
        toast('error', 'The user rejected the request', '')
      } else {
        toast('error', error, '')
      }
    }
    setIsLoading(false)
  }

  return (
    <Button onClick={() => stakeToad()} className='font-light' loading={isLoading}>
      STAKE
    </Button>
  )
}

export default StakeButton
