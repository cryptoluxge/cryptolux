import AddressBookButton from 'components/AddresBookButton'
import Alert from 'components/Alerts'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import Input from 'components/Input'
import Typography from 'components/Typography'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import { useState } from 'react'
import { getMultiWalletNftBalance } from 'utils/APIs/MoralisAPI'
import { shortAddress } from 'utils/WalletHelpers'
import { getExplorerURL } from 'utils/getExplorerURL'

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
        const data = await getMultiWalletNftBalance(addressList)
        setBalances(data)
      } else {
        const data = await getMultiWalletNftBalance(Array(address))
        setBalances(data)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='w-full lg:w-[550px] xl:w-[600px]'>
          <Card title='NFT ბალანსის შემოწმება' titleBorder={true}>
            <div className='p-2'>
              <div className='mb-2 bg-darkBackground p-1 rounded-md border-[1px] border-lightBorder'>
                <Typography color='text-gray-500 text-sm'>შეამოწმეთ ერთ ან რამოდენიმე საფულის NFT ბალანსი ერთდროულად EVM ქსელებზე.</Typography>
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
      <div className='w-full'>
        {Object.keys(balances).length > 0 && (
          <div>
            <div className='flex items-center justify-center mt-2'>
              <div className='w-full lg:w-[550px] xl:w-[600px] space-y-2'>
                {balances.map((x) => (
                  <Card key={Math.random(0, 999)} title={shortAddress(x.address, 6)} variant='collapsible'>
                    <div className='px-2'>
                      {x.data.map((y, index) => (
                        <div key={index} className='mb-2'>
                          <Card title={`${y.chainSymbol} ქსელი - ${y.balance.result.length} NFT`} variant='collapsible'>
                            <div className=''>
                              <div className='px-2 py-1'>
                                <a href={getExplorerURL('evm', y.chainId, 'wallet', x.address)} target='_blank' rel='noreferrer' className='text-primary text-sm'>
                                  ნახე Explorer-ზე
                                </a>
                              </div>
                              {y.status === 200 ? (
                                <div>
                                  {y.balance.result.length > 0 ? (
                                    <Table>
                                      <Thead>
                                        <HeadTr>
                                          <HeadTh>#</HeadTh>
                                          <HeadTh>სახელი</HeadTh>
                                          <HeadTh>სიმბოლო</HeadTh>
                                        </HeadTr>
                                      </Thead>
                                      <Tbody>
                                        {y.balance.result.map((z, index) => (
                                          <BodyTr key={index}>
                                            <BodyTd isLast={index !== y.balance.result.length - 1} rightCorner={index === y.balance.result.length - 1}>
                                              <Typography>{index + 1}</Typography>
                                            </BodyTd>
                                            <BodyTd isLast={index !== y.balance.result.length - 1}>
                                              <div className='flex items-center gap-2'>
                                                <Typography>{z.name}</Typography>
                                              </div>
                                            </BodyTd>
                                            <BodyTd isLast={index !== y.balance.result.length - 1} leftCorner={index === y.balance.result.length - 1}>
                                              <Typography>{z.symbol}</Typography>
                                            </BodyTd>
                                          </BodyTr>
                                        ))}
                                      </Tbody>
                                    </Table>
                                  ) : (
                                    <div className='p-2'>
                                      <Alert variant='info' text={`${y.chainSymbol} ქსელზე NFT არ არის!`} />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className='p-2'>
                                  <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
