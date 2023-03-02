import { useWeb3React } from '@web3-react/core'
import AVAX from 'assets/images/Blockchains/Avalanche.svg'
import BSC from 'assets/images/Blockchains/Binance.svg'
import ETH from 'assets/images/Blockchains/Ethereum.svg'
import Fantom from 'assets/images/Blockchains/Fantom.svg'
import Matic from 'assets/images/Blockchains/Matic.svg'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import ChangeNetwork from 'components/ConnectWallet/Ethereum/WrongNetwork'
import Input from 'components/Input'
import { useToast } from 'hooks/useToast'
import { useEffect, useState } from 'react'
import { FaQuestion } from 'react-icons/fa'
import { getChainDataById } from 'utils/WalletHelpers'
import Web3 from 'web3'

const Index = () => {
  const { account, chainId, active } = useWeb3React()
  const [userBalance, setUserBalance] = useState()
  const web3 = new Web3(window.ethereum)
  const toast = useToast()
  const setMAX = () => {
    document.getElementById('sentNativeAmount').value = userBalance
  }

  const getUserBalance = async () => {
    const balance = await web3.eth.getBalance(account.toLowerCase())
    setUserBalance(web3.utils.fromWei(balance, 'ether'))
  }

  const send = async () => {
    const toAddress = document.getElementById('reciverAddressNative').value
    const value = document.getElementById('sentNativeAmount').value

    if (toAddress === '') {
      toast('error', 'შეიყვანეთ მისამართი')
    } else {
      if (web3.utils.checkAddressChecksum(toAddress)) {
        if (value === '') {
          toast('error', 'შიყვანეთ რაოდენობა')
        } else if (value === '0') {
          toast('error', 'შიყვანეთ რაოდენობა. (0 არა)')
        } else {
          const valueInWei = web3.utils.toWei(value, 'ether')
          const transactionParameters = {
            to: toAddress, // Required except during contract publications.
            from: account, // must match user's active address.
            value: web3.utils.toHex(valueInWei), // Only required to send ether to the recipient from the initiating external account.
          }
          await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          })
        }
      } else {
        toast('error', 'მისამართი არასწორია!')
      }
    }
  }

  useEffect(() => {
    if (active === true) {
      document.getElementById('sentNativeAmount').removeAttribute('disabled')
      document.getElementById('reciverAddressNative').removeAttribute('disabled')
      getUserBalance()
    }
    // eslint-disable-next-line
  }, [active])

  return (
    <Card>
      <div className='bg-lightCard rounded-lg p-3'>
        <div className='flex flex-col items-center justify-center'>
          {chainId === 56 || chainId === 1 || chainId === 43114 || chainId === 250 || chainId === 137 ? (
            <div>
              {chainId === 56 ? (
                <div className='w-[42px] h-[42px] bg-yellow-500 rounded-lg flex justify-center'>
                  <Avatar src={BSC} alt='' className='w-8' />
                </div>
              ) : null}
              {chainId === 1 ? (
                <div className='w-[42px] h-[42px] bg-blue-500 rounded-lg flex justify-center'>
                  <Avatar src={ETH} alt='' className='w-5' />
                </div>
              ) : null}
              {chainId === 43114 ? (
                <div className='w-[42px] h-[42px] bg-red-500 rounded-lg flex justify-center'>
                  <Avatar src={AVAX} alt='' className='w-6' />
                </div>
              ) : null}
              {chainId === 250 ? (
                <div className='w-[42px] h-[42px] bg-blue-500 rounded-lg flex justify-center'>
                  <Avatar src={Fantom} alt='' className='w-4' />
                </div>
              ) : null}
              {chainId === 137 ? (
                <div className='w-[42px] h-[42px] bg-red-500 rounded-lg flex justify-center'>
                  <Avatar src={Matic} alt='' className='w-6' />
                </div>
              ) : null}
            </div>
          ) : (
            <div className='w-[42px] h-[42px] bg-red-500 rounded-lg flex justify-center items-center'>
              <FaQuestion className='text-white text-2xl' />
            </div>
          )}
          {active ? <p className='text-lightText  font-bold mt-2'>{getChainDataById(chainId).symbol}</p> : null}
        </div>
        <div className='border-[1px] border-lightBorder mt-3 mb-3'></div>
        <div>
          <div className='flex justify-between items-center mt-5'>
            <p className='text-lightText  font-bold'>ბალანსი:</p>
            <p className='text-lightText  font-bold'>{active ? `${Number(userBalance).toFixed(5)}` : '0.00'}</p>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-lightText  font-bold'>გაგზავნა:</p>
          <div className='flex items-center gap-2 mt-1'>
            <Input disabled id='sentNativeAmount' type='text' placeholder='რაოდენობა' />
            {active ? <Button onClick={() => setMAX()}>MAX</Button> : null}
          </div>
          <div className='mt-2'>
            <Input disabled id='reciverAddressNative' type='text' placeholder='მიმღების მისამართი' />
          </div>
          {active === true ? (
            <div>
              {chainId === 1 || chainId === 56 || chainId === 43114 || chainId === 250 || chainId === 137 ? (
                <div className='mt-2'>
                  <Button onClick={() => send()} type='button'>
                    გაგზავნა
                  </Button>
                </div>
              ) : (
                <div className='flex justify-center mt-3'>
                  <ChangeNetwork changeTo='BSC' text='შეცვალეთ ქსელი' />
                </div>
              )}
            </div>
          ) : (
            <div className='flex justify-center mt-3 w-full'>
              <ConnectButton text='დააკავშირეთ საფულე' />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Index
