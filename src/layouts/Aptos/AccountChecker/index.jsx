import AddressBookButton from 'components/AddresBookButton'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import Input from 'components/Input'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { checkAccountData } from 'utils/APIs/AptosAPI'
import { shortAddress } from 'utils/WalletHelpers'

const Index = () => {
  const [isLoading, setIsLoading] = useState(Boolean)
  const [multipleAddressCount, setMultipleAddressCount] = useState(0)
  const [accountsData, setAccountsData] = useState([])

  const toast = useToast()

  const checkAccount = async () => {
    const address = document.getElementById('aptosWalletAddress').value
    if (address === '' || address === null || address === undefined) {
      toast('error', 'Please enter wallet address or addresses')
    } else {
      setIsLoading(true)
      setAccountsData([])
      setMultipleAddressCount(0)
      if (String(address).includes(',')) {
        const addresses = String(address).split(',')
        setMultipleAddressCount(Object.keys(addresses).length)
        const getData = await checkAccountData(addresses)
        setAccountsData(getData)
      } else {
        const getData = await checkAccountData(Array(address))
        setAccountsData(getData)
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
                <Typography color='text-gray-500 text-sm'>შეამოწმეთ ერთ ან რამოდენიმე საფულე ერთდროულად.</Typography>
                <Typography color='text-gray-500 text-sm'>
                  გამოყავით საფულის მისამართები <span className='text-primary font-bold'>მძიმით.</span>
                </Typography>
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-2 w-full'>
                <div className='flex items-center gap-2 w-full'>
                  <Input onKeyDown={(e) => e.key === 'Enter' && checkAccount()} id='aptosWalletAddress' placeholder='შეიყვანეთ საფულის მისამართ ან მისამართები' />
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
      <div className='flex items-center justify-center mt-2'>
        {Object.keys(accountsData).length > 0 && (
          <div className='w-full lg:w-[550px] xl:w-[600px]'>
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
                    <HeadTh>
                      Tokens
                    </HeadTh>
                    <HeadTh>
                      NFTs
                    </HeadTh>
                  </HeadTr>
                </Thead>
                <Tbody>
                  {accountsData.map((y, index) => (
                    <BodyTr key={index}>
                      <BodyTd isLast={index !== accountsData.length - 1} rightCorner={index === accountsData.length - 1}>
                        <Typography>{index + 1}</Typography>
                      </BodyTd>
                      <BodyTd isLast={index !== accountsData.length - 1}>
                        <Typography>{shortAddress(y.address, 6)}</Typography>
                      </BodyTd>
                      <BodyTd isLast={index !== accountsData.length - 1}>
                        <Typography>{y.data.getAptBalance.status === 200 ? y.data.getAptBalance.data[0].balance : 'ERROR'}</Typography>
                      </BodyTd>
                      <BodyTd isLast={index !== accountsData.length - 1}>
                        <Typography>{y.data.getTokensBalance.status === 200 && Object.keys(y.data.getTokensBalance.data).length > 0 ? Object.keys(y.data.getTokensBalance.data[0].data).length : 0}</Typography>
                      </BodyTd>
                      <BodyTd isLast={index !== accountsData.length - 1} leftCorner={index === accountsData.length - 1}>
                        <Typography>{y.data.getNftsBalance.status === 200 && Object.keys(y.data.getNftsBalance.data[0].data).length > 0 ? Object.keys(y.data.getNftsBalance.data[0].data).length : 0}</Typography>
                      </BodyTd>
                    </BodyTr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
