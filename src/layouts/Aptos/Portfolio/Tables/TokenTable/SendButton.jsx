import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import BigNumber from 'bignumber.js'
import AddressBookButton from 'components/AddresBookButton'
import Alert from 'components/Alerts'
import Button from 'components/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import Typography from 'components/Typography'
import { APTOS_MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { checkAddress, isValidAddress } from 'utils/Helpers/AptosHelpers/Helpers'
import { shortAddress } from 'utils/WalletHelpers'
/* import { getTokenLogo } from '../Helper' */
import AddressResult from './AddressResult'

const SendButton = ({ data, ...rest }) => {
  const { signAndSubmitTransaction } = useWallet()
  const [open, setOpen] = useState(false)
  const [addressData, setAddressData] = useState([])
  const [sendTokenAmount, setTokenAmount] = useState(0)
  const [sendingTokenData, setSendingTokenData] = useState([])
  const toast = useToast()
  const aptosClient = new AptosClient(APTOS_MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const setMaxAmount = () => {
    document.getElementById('tokenAmount').value = data.amount / 10 ** data.coin_info.decimals
  }

  const handleTokenAmount = () => {
    setTokenAmount(0)
    setSendingTokenData([])
    const sendingAmount = document.getElementById('tokenAmount').value
    if (Number(sendingAmount) > Number(data.amount) / 10 ** data.coin_info.decimals) {
      setSendingTokenData({ status: 'error', text: 'არასაკმარისი ბალანსი' })
    } else {
      setSendingTokenData([])
      setTokenAmount(Number(sendingAmount))
    }
  }

  const handleCheckAddress = async () => {
    setAddressData([])
    const walletAddress = document.getElementById('receiverAddress').value
    if (isValidAddress(walletAddress) || String(walletAddress).endsWith('.apt')) {
      const getData = await checkAddress(walletAddress, data)
      setAddressData(getData)
    }
  }

  const sendTransactions = async () => {
    const getAmount = document.getElementById('tokenAmount').value
    const format = new BigNumber(getAmount).multipliedBy(new BigNumber(10).pow(data.coin_info.decimals))
    const result = new BigNumber(format)
    const payload = {
      type: 'entry_function_payload',
      function: '0x1::coin::transfer',
      type_arguments: [data.coin_info.coin_type],
      arguments: [addressData.walletAddress, result.c[0]],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'ტრანზაქცია დადასტურდა', `გაიგზავნა ${getAmount} ${data.coin_info.symbol} ამ მისამართზე: ${shortAddress(addressData.address, 4)}`, response.hash)
      } else {
        toast('error', '', txResult.success, response.hash)
      }
    } catch (error) {
      if (error === 'თქვენ ტრანზაქცია არ დაადასტურეთ') {
        toast('error', 'თქვენ ტრანზაქცია არ დაადასტურეთ', '')
      } else {
        toast('error', error, '')
      }
    }
  }

  return (
    <div>
      <Button {...rest} onClick={() => setOpen(!open)} className='font-light'>
        გაგზავნა
      </Button>
      <Modal title={`გააგზავნე ${String(String(data.coin_info.symbol).toUpperCase()).toUpperCase()}`} open={open} close={() => setOpen(!open)}>
        <div className='p-2'>
          <div className='flex gap-2 mb-2'>
            {/* <img src={getTokenLogo(data.coin_type)} alt={data.coin_info.symbol} className='w-12 rounded-full' /> */}
            <div className='flex flex-col'>
              <Typography className='uppercase'>{data.coin_info.symbol}</Typography>
              <div className='flex flex-row gap-1'>
                <p className='text-gray-600'>ბალანსი:</p>
                <p className='text-gray-400'>{data.amount / 10 ** data.coin_info.decimals}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <Input id='tokenAmount' onChange={() => handleTokenAmount()} placeholder='რაოდენობა' />
              <Button onClick={() => setMaxAmount()}>სულ</Button>
            </div>
            {Object.keys(sendingTokenData).length > 0 && sendingTokenData.status === 'error' && <Alert variant={sendingTokenData.status} text={sendingTokenData.text} />}
            <div className='flex items-center gap-1'>
              <Input onChange={() => handleCheckAddress()} onPaste={() => handleCheckAddress()} id='receiverAddress' placeholder='მიმღების მისამართი ან .apt სახელი' />
              <AddressBookButton inputId='receiverAddress' />
            </div>
            {Object.keys(addressData).length > 0 && (
              <div>
                {addressData.status === 'error' && (
                  <div>
                    <AddressResult variant={addressData.status} text={addressData.error} />
                  </div>
                )}
                {addressData.status === 'success' && (
                  <div>
                    <AddressResult variant={addressData.status} text={addressData.walletAddress} balance={addressData.tokenBalance} />
                  </div>
                )}
                {addressData.status === 'warning' && (
                  <div>
                    <AddressResult variant={addressData.status} text={addressData.error} />
                  </div>
                )}
              </div>
            )}
            <Button disabled={(addressData.status === 'success' || addressData.status === 'warning') && Number(sendTokenAmount) > 0 ? false : true} onClick={() => sendTransactions()}>
              გაგზავნა
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SendButton
