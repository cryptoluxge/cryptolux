import { Tab } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'
import AVAX from 'assets/images/Blockchains/Avalanche.svg'
import BSC from 'assets/images/Blockchains/Binance.svg'
import ETH from 'assets/images/Blockchains/Ethereum.svg'
import FANTOM from 'assets/images/Blockchains/Fantom.svg'
import MATIC from 'assets/images/Blockchains/Matic.svg'
import BigNumber from 'bignumber.js'
import AddToWallet from 'components/AddToWallet'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import Input from 'components/Input'
import Modal from 'components/Modal'
import { useToast } from 'hooks/useToast'
import { useEffect, useState } from 'react'
import { getTokenBalances } from 'utils/APIs/MoralisAPI'
import { getBep20TokenContract } from 'utils/BNBChain/Helpers/contractHelpers'
import { shortAddress } from 'utils/WalletHelpers'
import Web3 from 'web3'

const Index = () => {
  const { account, active, chainId } = useWeb3React()
  const [bscTokenBalance, setBscTokenBalance] = useState([])
  const [ethTokenBalance, setEthTokenBalance] = useState([])
  const [avaxTokenBalance, setAvaxTokenBalance] = useState([])
  const [maticTokenBalance, setMaticTokenBalance] = useState([])
  const [fantomTokenBalance, setFantomTokenBalance] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [token, setToken] = useState([])
  const web3 = new Web3(window.ethereum)
  const toast = useToast()

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const getBalance = async () => {
    const dataBSC = await getTokenBalances(account, 'bsc')
    if (dataBSC === 'error') {
      setBscTokenBalance({ isERROR: true })
    } else {
      setBscTokenBalance(dataBSC)
    }

    const dataETH = await getTokenBalances(account, 'eth')
    if (dataETH === 'error') {
      setEthTokenBalance({ isERROR: true })
    } else {
      setEthTokenBalance(dataETH)
    }

    const dataAVAX = await getTokenBalances(account, 'avalanche')
    if (dataAVAX === 'error') {
      setAvaxTokenBalance({ isERROR: true })
    } else {
      setAvaxTokenBalance(dataAVAX)
    }

    const dataMATIC = await getTokenBalances(account, 'matic')
    if (dataMATIC === 'error') {
      setMaticTokenBalance({ isERROR: true })
    } else {
      setMaticTokenBalance(dataMATIC)
    }

    const dataFANTOM = await getTokenBalances(account, 'fantom')
    if (dataFANTOM === 'error') {
      setFantomTokenBalance({ isERROR: true })
    } else {
      setFantomTokenBalance(dataFANTOM)
    }
  }

  const sendToken = async (tokenAddress, reciverAddress, decimal, balance) => {
    const BIG_TEN = new BigNumber(10)
    const tokenContract = getBep20TokenContract(tokenAddress, chainId)
    const amount = new BigNumber(balance).times(BIG_TEN.pow(decimal))

    await tokenContract.methods
      .transfer(reciverAddress, web3.utils.toHex(amount))
      .send({ from: account })
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
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', '', receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
        }
      })
  }

  useEffect(() => {
    if (active === true) {
      getBalance()
    }
    // eslint-disable-next-line
  }, [active])

  return (
    <div className='w-full'>
      <Card>
        <div className='bg-lightCard  rounded-lg'>
          <p className='p-3 text-lightText'>ტოკენების ბალანსი</p>
          <Tab.Group>
            <div className='px-3'>
              <Tab.List className='flex rounded-xl bg-violet-600 p-1'>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected ? 'bg-violet-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }>
                  <div className='flex items-center justify-center gap-2'>
                    <Avatar src={BSC} alt='' className='w-5' />
                    <p className='font-bold text-white'>BSC</p>
                  </div>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected ? 'bg-violet-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }>
                  <div className='flex items-center justify-center gap-2'>
                    <Avatar src={ETH} alt='' className='w-5' />
                    <p className='font-bold text-white'>ETH</p>
                  </div>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected ? 'bg-violet-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }>
                  <div className='flex items-center justify-center gap-2'>
                    <Avatar src={AVAX} alt='' className='w-5' />
                    <p className='font-bold text-white'>AVAX</p>
                  </div>
                </Tab>
                <Tab className={({ selected }) => classNames('w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700', selected ? 'bg-dark shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white')}>
                  <div className='flex items-center justify-center gap-2'>
                    <Avatar src={MATIC} alt='' className='w-5' />
                    <p className='font-bold text-white'>MATIC</p>
                  </div>
                </Tab>
                <Tab className={({ selected }) => classNames('w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700', selected ? 'bg-dark shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white')}>
                  <div className='flex items-center justify-center gap-2'>
                    <Avatar src={FANTOM} alt='' className='w-3' />
                    <p className='font-bold text-white'>FTM</p>
                  </div>
                </Tab>
              </Tab.List>
            </div>
            {active ? (
              <Tab.Panels>
                <Tab.Panel>
                  <div className='overflow-x-auto shadow-md rounded-lg max-h-[500px]'>
                    {bscTokenBalance.isERROR ? (
                      <div className='flex justify-center text-center py-5'>
                        <p className='font-bold text-lightText'>დაფიქსირდა შეცდომა :( ცადეთ თავიდან.</p>
                      </div>
                    ) : (
                      <div>
                        {bscTokenBalance.length > 0 ? (
                          <table className='w-full shadow-md text-sm text-left text-lightText'>
                            <thead className='text-sm shadow-md text-lightText'>
                              <tr>
                                <th scope='col' className='px-6 py-3'>
                                  სახელი
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                  ბალანსი
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bscTokenBalance.map((x) => (
                                <tr
                                  onClick={chainId === 56 ? () => setModalOpen(!modalOpen) : () => toast('error', 'გადართეთ BSC ქსელზე')}
                                  onMouseEnter={() => setToken({ address: x.token_address, decimal: x.decimals, name: x.name, symbol: x.symbol, balance: Number(Number(x.balance) / 10 ** x.decimals) })}
                                  key={x.token_address}
                                  className='bg-white  hover:bg-lightHover  w-full cursor-pointer'>
                                  <td className='px-6 py-4'>
                                    <p className='font-bold text-lightText'>{x.symbol}</p>
                                  </td>
                                  <td className='px-6 py-4'>
                                    <p className='text-lightText'>{Number(Number(x.balance) / 10 ** x.decimals).toLocaleString('en-US')}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='flex justify-center text-center py-5'>
                            <p className='font-bold text-lightText'>BSC ქსელზე ტოკენები არ გაქვთ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className='overflow-x-auto shadow-md rounded-lg max-h-[500px]'>
                    {ethTokenBalance.isERROR ? (
                      <div className='flex justify-center text-center py-5'>
                        <p className='font-bold text-lightText'>დაფიქსირდა შეცდომა :( ცადეთ თავიდან.</p>
                      </div>
                    ) : (
                      <div>
                        {ethTokenBalance.length > 0 ? (
                          <table className='w-full shadow-md text-sm text-left text-lightText'>
                            <thead className='text-sm shadow-md text-lightText'>
                              <tr>
                                <th scope='col' className='px-6 py-3'>
                                  სახელი
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                  ბალანსი
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {ethTokenBalance.map((x) => (
                                <tr
                                  onClick={chainId === 1 ? () => setModalOpen(!modalOpen) : () => toast('error', 'გადართეთ ETH ქსელზე')}
                                  onMouseEnter={() => setToken({ address: x.token_address, decimal: x.decimals, name: x.name, symbol: x.symbol, balance: Number(Number(x.balance) / 10 ** x.decimals) })}
                                  key={x.token_address}
                                  className='bg-white  hover:bg-lightHover  w-full cursor-pointer'>
                                  <td className='px-6 py-4'>
                                    <p className='font-bold text-lightText'>{x.symbol}</p>
                                  </td>
                                  <td className='px-6 py-4'>
                                    <p className='text-lightText'>{Number(Number(x.balance) / 10 ** x.decimals).toLocaleString('en-US')}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='flex justify-center text-center py-5'>
                            <p className='font-bold text-lightText'>ETH ქსელზე ტოკენები არ გაქვთ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className='overflow-x-auto shadow-md rounded-lg max-h-[500px]'>
                    {avaxTokenBalance.isERROR ? (
                      <div className='flex justify-center text-center py-5'>
                        <p className='font-bold text-lightText'>დაფიქსირდა შეცდომა :( ცადეთ თავიდან.</p>
                      </div>
                    ) : (
                      <div>
                        {avaxTokenBalance.length > 0 ? (
                          <table className='w-full shadow-md text-sm text-left text-lightText'>
                            <thead className='text-sm shadow-md text-lightText'>
                              <tr>
                                <th scope='col' className='px-6 py-3'>
                                  სახელი
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                  ბალანსი
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {avaxTokenBalance.map((x) => (
                                <tr
                                  onClick={chainId === 43114 ? () => setModalOpen(!modalOpen) : () => toast('error', 'გადართეთ AVAX ქსელზე')}
                                  onMouseEnter={() => setToken({ address: x.token_address, decimal: x.decimals, name: x.name, symbol: x.symbol, balance: Number(Number(x.balance) / 10 ** x.decimals) })}
                                  key={x.token_address}
                                  className='bg-white  hover:bg-lightHover  w-full cursor-pointer'>
                                  <td className='px-6 py-4'>
                                    <p className='font-bold text-lightText'>{x.symbol}</p>
                                  </td>
                                  <td className='px-6 py-4'>
                                    <p className='text-lightText'>{Number(Number(x.balance) / 10 ** x.decimals).toLocaleString('en-US')}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='flex justify-center text-center py-5'>
                            <p className='font-bold text-lightText'>AVAX ქსელზე ტოკენები არ გაქვთ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className='overflow-x-auto shadow-md rounded-lg max-h-[500px]'>
                    {maticTokenBalance.isERROR ? (
                      <div className='flex justify-center text-center py-5'>
                        <p className='font-bold text-lightText'>დაფიქსირდა შეცდომა :( ცადეთ თავიდან.</p>
                      </div>
                    ) : (
                      <div>
                        {maticTokenBalance.length > 0 ? (
                          <table className='w-full shadow-md text-sm text-left text-lightText'>
                            <thead className='text-sm shadow-md text-lightText'>
                              <tr>
                                <th scope='col' className='px-6 py-3'>
                                  სახელი
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                  ბალანსი
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {maticTokenBalance.map((x) => (
                                <tr
                                  onMouseEnter={() => setToken({ address: x.token_address, decimal: x.decimals, name: x.name, symbol: x.symbol, balance: Number(Number(x.balance) / 10 ** x.decimals) })}
                                  key={x.token_address}
                                  className='bg-white  hover:bg-lightHover  w-full cursor-pointer'>
                                  <td className='px-6 py-4'>
                                    <p className='font-bold text-lightText'>{x.symbol}</p>
                                  </td>
                                  <td className='px-6 py-4'>
                                    <p className='text-lightText'>{Number(Number(x.balance) / 10 ** x.decimals).toLocaleString('en-US')}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='flex justify-center text-center py-5'>
                            <p className='font-bold text-lightText'>MATIC ქსელზე ტოკენები არ გაქვთ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className='overflow-x-auto shadow-md rounded-lg max-h-[500px]'>
                    {fantomTokenBalance.isERROR ? (
                      <div className='flex justify-center text-center py-5'>
                        <p className='font-bold text-lightText'>დაფიქსირდა შეცდომა :( ცადეთ თავიდან.</p>
                      </div>
                    ) : (
                      <div>
                        {fantomTokenBalance.length > 0 ? (
                          <table className='w-full shadow-md text-sm text-left text-lightText'>
                            <thead className='text-sm shadow-md text-lightText'>
                              <tr>
                                <th scope='col' className='px-6 py-3'>
                                  სახელი
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                  ბალანსი
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {fantomTokenBalance.map((x) => (
                                <tr
                                  onMouseEnter={() => setToken({ address: x.token_address, decimal: x.decimals, name: x.name, symbol: x.symbol, balance: Number(Number(x.balance) / 10 ** x.decimals) })}
                                  key={x.token_address}
                                  className='bg-white  hover:bg-lightHover  w-full cursor-pointer'>
                                  <td className='px-6 py-4'>
                                    <p className='font-bold text-lightText'>{x.symbol}</p>
                                  </td>
                                  <td className='px-6 py-4'>
                                    <p className='text-lightText'>{Number(Number(x.balance) / 10 ** x.decimals).toLocaleString('en-US')}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='flex justify-center text-center py-5'>
                            <p className='font-bold text-lightText'>FANTOM ქსელზე ტოკენები არ გაქვთ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            ) : (
              <div className='py-5 flex justify-center'>
                <ConnectButton text='დააკავშირეთ საფულე' />
              </div>
            )}
          </Tab.Group>
        </div>
      </Card>
      <Modal title='ტოკენის გაგზავნა' open={modalOpen} close={() => setModalOpen(!modalOpen)}>
        <div className='px-3'>
          <p className='text-lightText'>
            <span className='font-bold text-sm'>სახელი:</span> {token.name} ({token.symbol})
          </p>
          <p className='text-lightText'>
            <span className='font-bold text-sm'>ბალანსი:</span> {token.balance}
          </p>
          <p className='text-lightText'>
            <span className='font-bold text-sm'>კონტრაქტი:</span>{' '}
            <a href={`https://bscscan.com/address/${token.address}`} target='_blank' rel='noreferrer' className='text-lightText'>
              {shortAddress(token.address, 5)}
            </a>
          </p>
          <AddToWallet variant='text' address={token.address} decimal={token.decimal} symbol={token.symbol} />
          <div className='rounded-t border-b border-gray-600  rounded-3xl mt-2'></div>
          <p className='text-lightText  mt-2 font-bold text-sm'>გაგზავნა</p>
          <div className='flex items-center gap-2 mt-1'>
            <Input id='sentAmount' type='text' placeholder='რაოდენობა' />
            <Button onClick={() => (document.getElementById('sentAmount').value = token.balance)}>MAX</Button>
          </div>
          <div className='mt-2'>
            <Input id='reciverAddress' type='text' placeholder='მიმღების მისამართი' />
          </div>
          <div className='py-2'>
            <Button onClick={() => sendToken(token.address, document.getElementById('reciverAddress').value, token.decimal, document.getElementById('sentAmount').value)} type='button'>
              გაგზავნა
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Index
