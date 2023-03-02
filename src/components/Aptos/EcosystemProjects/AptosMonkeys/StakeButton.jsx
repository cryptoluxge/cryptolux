import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import Button from 'components/Button'
import { APTOS_MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'

const MonkeysStakeButton = ({ name, propertyVersion }) => {
  const { signAndSubmitTransaction } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const aptosClient = new AptosClient(APTOS_MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const stakeToad = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391::safari::start_adventure',
      type_arguments: ['0x5d410456c28307fd31439c1658b5e6b41f4ba868d63e03598c1ddb4a7b29449::asset::SeedzCoin'],
      arguments: ['0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391', name, propertyVersion],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'Transaction Confirmd', `You have successfully staked ${name}`, response.hash)
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

export default MonkeysStakeButton
