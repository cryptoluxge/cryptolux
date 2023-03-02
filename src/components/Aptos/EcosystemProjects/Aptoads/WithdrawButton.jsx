import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import Button from 'components/Button'
import Modal from 'components/Modal'
import Typography from 'components/Typography'
import { APTOS_MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'

const WithdrawButton = ({ data, earnedFly, daysStaked, stakedAt }) => {
  const [open, setOpen] = useState(false)
  const { signAndSubmitTransaction } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const aptosClient = new AptosClient(APTOS_MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const withdrawToad = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::user_unstake_tokens',
      type_arguments: ['0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::FlyCoin'],
      arguments: ['0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115', [data], 'Aptos Toad Overload'],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'Transaction Confirmd', `You have successfully claimed ${data} and ${earnedFly} FLY tokens`, response.hash)
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

  const claimFly = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::user_claim_rewards',
      type_arguments: ['0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::FlyCoin'],
      arguments: ['0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115', [data], 'Aptos Toad Overload'],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'ტრანზაქცია დადასტურდა', `You have successfully claimed ${earnedFly} FLY tokens`, response.hash)
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
    <div className='mt-2'>
      <Button onClick={() => setOpen(!open)} className='font-light'>
        გამოტანა
      </Button>
      <Modal title='UNSTAKE OR CLAIM' open={open} close={() => setOpen(!open)}>
        <div className='p-3'>
          <div className='flex gap-2'>
            <div className='flex-shrink-0'>
              <img src={`https://aptoads.nyc3.digitaloceanspaces.com/mainnet/${String(data).split('#')[1]}.png`} alt='Toad' className='w-[100px] rounded-lg' />
            </div>
            <div>
              <Typography>{data}</Typography>
              <Typography>
                <span className='text-gray-500 text-sm'>დაგროვებული: </span>
                {earnedFly} FLY
              </Typography>
              <Typography>
                <span className='text-gray-500 text-sm'>დასტეიკებულია: </span>
                {daysStaked}d
              </Typography>
              <Typography>
                <span className='text-gray-500 text-sm'>დასტეიკდა: </span>
                {stakedAt}
              </Typography>
            </div>
          </div>
          <div className='border-b border-lightBorder rounded-lg mt-2'></div>
          <div>
            <div className='flex flex-col sm:flex-row justify-end gap-2 mt-2'>
              <Button onClick={() => withdrawToad()} loading={isLoading} className='w-full'>
                UNSTAKE
              </Button>
              <Button onClick={() => claimFly()} loading={isLoading} className='w-full'>
                CLAIM {earnedFly} FLY
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WithdrawButton
