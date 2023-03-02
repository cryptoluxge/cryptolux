import AddressBookButton from 'components/AddresBookButton'
import Alert from 'components/Alerts'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import Input from 'components/Input'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { getAPTBalanceForWallets } from 'utils/APIs/AptosAPI'
import { shortAddress } from 'utils/WalletHelpers'

const Index = () => {
  const [isLoading, setIsLoading] = useState(Boolean)
  const [balances, setBalances] = useState([])
  const [multipleAddressCount, setMultipleAddressCount] = useState(0)
  const toast = useToast()

  const checkAptBalance = async () => {
    const address = document.getElementById('aptosWalletAddress').value
    if (address === '' || address === null || address === undefined) {
      toast('error', 'Please enter wallet address or addresses')
    } else {
      setIsLoading(true)
      setBalances([])
      setMultipleAddressCount(0)
      if (String(address).includes(',')) {
        const addresses = String(address).split(',')
        setMultipleAddressCount(Object.keys(addresses).length)
        const getData = await getAPTBalanceForWallets(addresses)
        setBalances(getData)
      } else {
        const getData = await getAPTBalanceForWallets(Array(address))
        setBalances(getData)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='w-full lg:w-[550px] xl:w-[600px]'>
          <Card title='APT ბალანსის შემოწმება' titleBorder={true}>
            <div className='p-2'>
              <div className='mb-2 bg-darkBackground p-1 rounded-md border-[1px] border-lightBorder'>
                <Typography color='text-gray-500 text-sm'>შეამოწმეთ ერთი ან რამოდენიმე საფულის APT ბალანსი ერთდროულად.</Typography>
                <Typography color='text-gray-500 text-sm'>
                  საფულის მისამართები გამოყავით <span className='text-primary font-bold'>მძიმით.</span>
                </Typography>
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-2'>
                <div className='flex items-center gap-2 w-full'>
                  <Input onKeyDown={(e) => e.key === 'Enter' && checkAptBalance()} id='aptosWalletAddress' placeholder='შეიყვანეთ საფულის მისამართ ან მისამართები' />
                  <AddressBookButton />
                </div>
                <Button onClick={() => checkAptBalance()} loading={isLoading}>
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
      <div className='flex items-center justify-center mt-2'>
        {Object.keys(balances).length > 0 && (
          <div className='w-full md:w-[550px]'>
            {balances.status === 200 ? (
              <Card>
                <Table>
                  <Thead>
                    <HeadTr>
                      <HeadTh>
                        #
                      </HeadTh>
                      <HeadTh>
                        Address
                      </HeadTh>
                      <HeadTh>
                        APT Balance
                      </HeadTh>
                    </HeadTr>
                  </Thead>
                  <Tbody>
                    {balances.data.map((x, index) => (
                      <BodyTr key={index}>
                        <BodyTd isLast={index !== balances.data.length - 1} rightCorner={index === balances.data.length - 1}>
                          <Typography>{index + 1}</Typography>
                        </BodyTd>
                        <BodyTd isLast={index !== balances.data.length - 1}>
                          <Typography>{shortAddress(x.address, 5)}</Typography>
                        </BodyTd>
                        <BodyTd isLast={index !== balances.data.length - 1} leftCorner={index === balances.data.length - 1}>
                          <Typography>{x.balance}</Typography>
                        </BodyTd>
                      </BodyTr>
                    ))}
                  </Tbody>
                </Table>
              </Card>
            ) : (
              <div>
                <Alert variant={balances.statusCode} text={balances.errorText} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
