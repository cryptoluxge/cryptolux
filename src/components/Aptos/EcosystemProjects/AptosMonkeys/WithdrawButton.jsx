import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import Button from 'components/Button'
import Modal from 'components/Modal'
import Typography from 'components/Typography'
import { APTOS_MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'

const WithdrawButton = ({ data, earnedSeedz, timeStaked, stakedAt }) => {
  const [open, setOpen] = useState(false)
  const { signAndSubmitTransaction } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const aptosClient = new AptosClient(APTOS_MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const withdrawMonkey = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391::safari::end_adventure',
      type_arguments: ['0x5d410456c28307fd31439c1658b5e6b41f4ba868d63e03598c1ddb4a7b29449::asset::SeedzCoin'],
      arguments: ['0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391', data.adventure_id.creation_num],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'Transaction Confirmd', `You have successfully claimed ${data.token_name} and ${earnedSeedz} SEEDZ tokens`, response.hash)
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

  const claimSeedz = async () => {
    setIsLoading(true)
    const payload = {
      type: 'entry_function_payload',
      function: '0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391::safari::claim_rewards',
      type_arguments: ['0x5d410456c28307fd31439c1658b5e6b41f4ba868d63e03598c1ddb4a7b29449::asset::SeedzCoin'],
      arguments: ['0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391', data.adventure_id.creation_num],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'Transaction Confirmd', `You have successfully claimed ${earnedSeedz} SEEDZ tokens`, response.hash)
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
              <img src={`https://ipfs.io/ipfs/bafybeig6bepf5ci5fyysxlfefpjzwkfp7sarj6ed2f5a34kowgc6qenjfa/${String(data.token_name).split('#')[1]}.png`} alt='monke' className='w-[100px] rounded-lg' />
            </div>
            <div>
              <Typography>{data.token_name}</Typography>
              <Typography>
                <span className='text-gray-500 text-sm'>დაგროვებული: </span>
                {earnedSeedz} SEEDZ
              </Typography>
              <Typography>
                <span className='text-gray-500 text-sm'>დასტეიკებული დრო: </span>
                {timeStaked}სთ
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
              <Button onClick={() => withdrawMonkey()} loading={isLoading} className='w-full'>
                UNSTAKE
              </Button>
              <Button onClick={() => claimSeedz()} loading={isLoading} className='w-full'>
                CLAIM {earnedSeedz} SEEDZ
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WithdrawButton
