import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import Input from 'components/Input'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { getTokenBalances } from 'utils/APIs/MoralisAPI'
import { shortAddress } from 'utils/WalletHelpers'
import Web3 from 'web3'

const Index = () => {
  const [tokenBalances, setTokenBalances] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenSearch, setIsTokenSearch] = useState(false)
  const web3 = new Web3('https://bsc-dataseed1.binance.org/')
  const toast = useToast()

  const getBalance = async () => {
    setIsLoading(!isLoading)
    setTokenBalances([])
    const chaintoCheck = document.getElementById('selectedChain').value
    const walletToCheck = document.getElementById('walletAddress').value
    const blockToCheck = document.getElementById('atBlockNumber').value
    const correctAddress = web3.utils.toChecksumAddress(walletToCheck)
    const isCorrectAddress = web3.utils.checkAddressChecksum(correctAddress)

    if (walletToCheck === '') {
      toast('error', 'შეიყვანეთ საფულის მისამართი')
    } else if (blockToCheck === '') {
      toast('error', 'შეიყვანეთ ბლოკის ნომერი')
    } else if (isCorrectAddress === false) {
      toast('error', 'მისამართი არასოწრია')
    } else if (chaintoCheck === 'no') {
      toast('error', 'აირჩიეთ ქსელი რომელზეც გინდათ შეამოწმოთ')
    } else if (isCorrectAddress === true && Number(blockToCheck) > 0) {
      if (isTokenSearch === true) {
        const tokenToCheck = document.getElementById('tokenContract').value
        const data = await getTokenBalances(walletToCheck, chaintoCheck, Number(blockToCheck), tokenToCheck)
        setTokenBalances(data)
        if (data.length === 0) {
          toast('error', `${String(chaintoCheck).toUpperCase()} ქსელზე N${blockToCheck} ბლოკზე ტოკენების ბალანსი არ არის!`)
        }
      } else {
        const data = await getTokenBalances(walletToCheck, chaintoCheck, Number(blockToCheck))
        setTokenBalances(data)
        if (data.length === 0) {
          toast('error', `${String(chaintoCheck).toUpperCase()} ქსელზე N${blockToCheck} ბლოკზე ტოკენების ბალანსი არ არის!`)
        }
      }
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col lg:flex-row justify-center gap-2'>
      <div className='w-full lg:w-[400px]'>
        <Card title='ტოკენების ბალანსი ბლოკზე' titleBorder={true}>
          <div className='px-2 mb-3 mt-2'>
            <div className='mb-2'>
              <select id='selectedChain' className='bg-lightCard text-lightText text-sm rounded-lg block w-full p-2 border border-lightBorder'>
                <option value='no'>აირჩიეთ ქსელი</option>
                <option value='eth'>Ethereum</option>
                <option value='bsc'>Smart Chain</option>
                <option value='avalanche'>Avalanche</option>
                <option value='polygon'>Polygon</option>
                <option value='fantom'>Fantom</option>
                <option value='cronos'>Cronos</option>
              </select>
            </div>
            <div>
              <Input id='walletAddress' placeholder='საფულის მისამართი' />
              <div className='mt-2'>
                <Input id='atBlockNumber' placeholder='ბლოკის ნომერი' />
              </div>
              <div className='mt-2'>
                <label className='inline-flex relative items-center cursor-pointer'>
                  <input onClick={() => setIsTokenSearch(!isTokenSearch)} type='checkbox' className='sr-only peer' />
                  <div className="w-11 h-6 bg-lightBorder peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-primary"></div>
                  <span className='ml-3 text-sm font-medium text-lightText'>ტოკენით ძებნა</span>
                </label>
              </div>
              {!isTokenSearch ? null : <Input id='tokenContract' placeholder='ტოკენის კონტრაქტი' />}
              {isLoading ? null : (
                <div className='mt-2'>
                  <Button onClick={() => getBalance()}>ძებნა</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div>
        {tokenBalances.length > 0 ? (
          <Card title='ბალანსი'>
            <div className='h-auto max-h-[500px] overflow-y-auto overflow-x-hidden'>
              <table className='w-full text-sm text-left border-lightBorder text-lightText  mt-2'>
                <thead className='text-sm text-lightText'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      სახელი
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      ბალანსი
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      კონტრაქტი
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokenBalances.map((token, index) => (
                    <tr key={index} className='bg-white  hover:bg-lightHover w-full cursor-pointer'>
                      <td className='px-6 py-4 flex items-center gap-2'>
                        <Avatar src='' />
                        <a href={`https://bscscan.com/address/${token.token_address}`} target='_blank' rel='noreferrer' className='text-lightText  hover:underline'>
                          {token.symbol}
                        </a>
                      </td>
                      <td className='px-6 py-4'>
                        <p className='text-lightText'>{Number(Number(token.balance) / 10 ** token.decimals).toLocaleString('en-US')}</p>
                      </td>
                      <td className='px-6 py-4'>
                        <a href={`https://bscscan.com/address/${token.token_address}`} target='_blank' rel='noreferrer' className='text-lightText  hover:underline'>
                          {shortAddress(token.token_address, 5)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

export default Index
