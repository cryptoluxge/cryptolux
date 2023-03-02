import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import AddToWallet from 'components/AddToWallet'
import Alert from 'components/Alerts'
import Button from 'components/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import Skelaton from 'components/Skelaton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { getBep20TokenContract } from 'utils/BNBChain/Helpers/contractHelpers'
import { getChainDataById, getExplorerURL, shortAddress } from 'utils/WalletHelpers'
import Web3 from 'web3'

const Index = ({ data, networkId, isLoading }) => {
  const { account, chainId } = useWeb3React()
  const [token, setToken] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const web3 = new Web3(window.ethereum)
  const toast = useToast()

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
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', 'თქვენი ტოკენები გაიგზავნა', receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
        }
      })
  }

  return (
    <div>
      <div className='overflow-x-auto s rounded-lg max-h-[500px]'>
        {!isLoading ? (
          <div>
            {data.status === 200 ? (
              <div>
                {data.data.length > 0 ? (
                  <Table>
                    <Thead>
                      <HeadTr>
                        <HeadTh>
                          სახელი
                        </HeadTh>
                        <HeadTh>
                          ბალანსი
                        </HeadTh>
                        <HeadTh>
                          კონტრაქტი
                        </HeadTh>
                        <HeadTh>
                        </HeadTh>
                        <HeadTh>
                        </HeadTh>
                      </HeadTr>
                    </Thead>
                    <Tbody>
                      {data.data.map((x, index) => (
                        <BodyTr key={x.token_address} onMouseEnter={() => setToken({ address: x.token_address, decimal: x.decimals, name: x.name, symbol: x.symbol, balance: Number(Number(x.balance) / 10 ** x.decimals) })}>
                          <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                            <p className='font-light text-lightText'>{x.symbol}</p>
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.length - 1}>
                            <p className='text-lightText'>{Number(Number(x.balance) / 10 ** x.decimals).toLocaleString('en-US')}</p>
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.length - 1}>
                            <a href={`${getExplorerURL('evm', networkId, 'token', x.token_address)}`} target='_blank' rel='noreferrer' className='text-lightText  hover:underline'>
                              {shortAddress(x.token_address, 5)}
                            </a>
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.length - 1}>
                            <p onClick={chainId === 56 ? () => setModalOpen(!modalOpen) : () => toast('error', 'გადართეთ BSC ქსელზე')} className='text-lightText  hover:underline'>
                              გაგზავნა
                            </p>
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.length - 1} leftCorner={index === data.data.length - 1}>
                            <AddToWallet variant='text' address={x.token_address} decimal={x.decimals} symbol={x.symbol} />
                          </BodyTd>
                        </BodyTr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <div className='p-2'>
                    <Alert variant='info' text={`${getChainDataById(networkId)} ქსელზე ტოკენები არ გაქვთ`} />
                  </div>
                )}
              </div>
            ) : (
              <div className='p-2'>
                <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით.' />
              </div>
            )}
          </div>
        ) : (
          <div className='p-2'>
            <Skelaton width='full' />
          </div>
        )}
      </div>
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
          <div className='flex md:hidden'>
            <AddToWallet variant='text' address={token.address} decimal={token.decimal} symbol={token.symbol} />
          </div>
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
