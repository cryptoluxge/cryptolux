import AddressBookButton from 'components/AddresBookButton'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import Input from 'components/Input'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useState } from 'react'
import { getMultiwalletNativeBalance } from 'utils/APIs/MoralisAPI'
import { getExplorerURL } from 'utils/getExplorerURL'
import { shortAddress } from 'utils/WalletHelpers'

const Index = () => {
  const [multipleAddressCount, setMultipleAddressCount] = useState(0)
  const [isLoading, setIsLoading] = useState(Boolean)
  const [balances, setBalances] = useState([])
  const toast = useState()

  const checkAccount = async () => {
    const address = document.getElementById('evmWalletAddress').value
    if (address === '' || address === null || address === undefined) {
      toast('error', 'Please enter wallet address or addresses')
    } else {
      setIsLoading(true)
      setBalances([])
      setMultipleAddressCount(0)
      if (String(address).includes(',')) {
        const addressList = String(address).split(',')
        setMultipleAddressCount(Object.keys(addressList).length)
        const data = await getMultiwalletNativeBalance(addressList)
        setBalances(data)
      } else {
        const data = await getMultiwalletNativeBalance(Array(address))
        setBalances(data)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='w-full lg:w-[550px] xl:w-[600px]'>
          <Card title='საფულის შემოწმება' titleBorder={true}>
            <div className='p-2'>
              <div className='mb-2 bg-darkBackground p-1 rounded-md border-[1px] border-lightBorder'>
                <Typography color='text-gray-500 text-sm'>შეამოწმეთ ერთ ან რამოდენიმე საფულე ერთდროულად EVM ქსელებზე.</Typography>
                <Typography color='text-gray-500 text-sm'>
                  გამოყავით საფულის მისამართები <span className='text-primary font-bold'>მძიმით.</span>
                </Typography>
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-2 w-full'>
                <div className='flex items-center gap-2 w-full'>
                  <Input onKeyDown={(e) => e.key === 'Enter' && checkAccount()} id='evmWalletAddress' placeholder='შეიყვანეთ საფულის მისამართ ან მისამართები' />
                  <AddressBookButton />
                </div>
                <Button onClick={() => checkAccount()} loading={isLoading}>
                  შეამოწმე
                </Button>
              </div>
              {multipleAddressCount !== 0 && (
                <div className='mt-2'>
                  <Typography>Detected {multipleAddressCount} Address</Typography>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      {
        <div className='w-full'>
          {Object.keys(balances).length > 0 && (
            <div>
              <div className='flex items-center justify-center mt-2'>
                <div className='w-full lg:w-[550px] xl:w-[600px] space-y-2'>
                  {balances.map((y) => (
                    <Card key={Math.random(0, 999)} title={shortAddress(y.address, 6)} variant='collapsible'>
                      <Table>
                        <Thead>
                          <HeadTr>
                            <HeadTh>#</HeadTh>
                            <HeadTh>ქსელი</HeadTh>
                            <HeadTh>ბალანსი</HeadTh>
                            <HeadTh></HeadTh>
                          </HeadTr>
                        </Thead>
                        <Tbody>
                          {y.data.map((x, index) => (
                            <BodyTr key={index}>
                              <BodyTd isLast={index !== y.data.length - 1} rightCorner={index === y.data.length - 1}>
                                <Typography>{index + 1}</Typography>
                              </BodyTd>
                              <BodyTd isLast={index !== y.data.length - 1}>
                                <div className='flex items-center gap-2'>
                                  <Avatar src={x.chainLogo} alt='test' className={`${x.chainSymbol === 'FTM' || x.chainSymbol === 'ETH' ? 'w-3' : 'w-4'}`} />
                                  <Typography color={`${x.status === 200 ? 'text-lightText' : 'text-red-500'}`}>{x.chainSymbol}</Typography>
                                </div>
                              </BodyTd>
                              <BodyTd isLast={index !== y.data.length - 1}>
                                <Typography color={`${x.status === 200 ? 'text-lightText' : 'text-red-500'}`}>{x.status === 200 ? Number(x.balance).toFixed(8) : x.balance}</Typography>
                              </BodyTd>
                              <BodyTd isLast={index !== y.data.length - 1} leftCorner={index === y.data.length - 1}>
                                <a href={getExplorerURL('evm', x.chainId, 'wallet', y.address)} target='_blank' rel='noreferrer' className={`${x.status === 200 ? 'text-primary' : 'text-red-500'}`}>
                                  ნახე Explorer-ზე
                                </a>
                              </BodyTd>
                            </BodyTr>
                          ))}
                        </Tbody>
                      </Table>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default Index
