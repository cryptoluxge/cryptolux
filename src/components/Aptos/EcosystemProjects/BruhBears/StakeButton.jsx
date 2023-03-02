import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import Button from 'components/Button'
import { APTOS_MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'

const BearStakeButton = ({ name, propertyVersion }) => {
  const { signAndSubmitTransaction } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const aptosClient = new AptosClient(APTOS_MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const stakeToad = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0xcfe80c7cfae84f1b66cd2dc65db923360acaaaa6042d9ac7c389c09e033be60e::levels::deposit',
      type_arguments: [],
      arguments: [name, propertyVersion],
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

export default BearStakeButton
