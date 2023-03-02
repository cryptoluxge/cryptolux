import Alert from 'components/Alerts'
import AddressComponent from 'components/CryptoComponents/AddressComponent'
import LoadingPulse from 'components/Skelaton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { convertTimestampToDate } from 'utils/Helpers/AptosHelpers/Helpers'
import { getExplorerURL } from 'utils/getExplorerURL'
import { calculateFee, getAddressFromPayload, getAPTTransferAmount, getFunctionFromFunctionId } from 'utils/Helpers/AptosHelpers/TransactionHelpers'
import Status from './components/Status'

const Index = ({ walletAddress, data, isLoading }) => {
  return (
    <div>
      {!isLoading ? (
        <div>
          {!data.hasOwnProperty('status') ? (
            <div>
              {Object.keys(data).length > 0 ? (
                <Table>
                  <Thead>
                    <HeadTr>
                      <HeadTh>ბლოკი</HeadTh>
                      <HeadTh>სტატუსი</HeadTh>
                      <HeadTh>დრო</HeadTh>
                      <HeadTh>გამგზავნი</HeadTh>
                      <HeadTh>მიმღები</HeadTh>
                      <HeadTh>ფუნქცია</HeadTh>
                      <HeadTh>რაოდენობა</HeadTh>
                    </HeadTr>
                  </Thead>
                  <Tbody>
                    {data.map((x, index) => (
                      <BodyTr key={index}>
                        <BodyTd isLast={index !== data.length - 1} rightCorner={index === data.length - 1}>
                          <a href={getExplorerURL('APT', 0, 'tx', x.version)} target='_blank' rel='noreferrer'>
                            <Typography className='font-light whitespace-nowrap hover:underline' color='text-primary'>
                              {x.version}
                            </Typography>
                          </a>
                        </BodyTd>
                        <BodyTd isLast={index !== data.length - 1}>
                          <Status status={x.success} />
                        </BodyTd>
                        <BodyTd isLast={index !== data.length - 1}>
                          <Typography className='font-light whitespace-nowrap'>{convertTimestampToDate(x.timestamp)}</Typography>
                        </BodyTd>
                        <BodyTd isLast={index !== data.length - 1}>
                          <div className='flex'>
                            <div className='bg-lightBackground px-3 py-1 rounded-lg'>
                              <AddressComponent address={x.sender} chain='APT' type='wallet' />
                            </div>
                          </div>
                        </BodyTd>
                        <BodyTd isLast={index !== data.length - 1}>
                          <div className='flex'>
                            <div className='bg-lightBackground px-3 py-1 rounded-lg'>
                              <AddressComponent address={getAddressFromPayload(x)} chain='APT' type='wallet' />
                            </div>
                          </div>
                        </BodyTd>
                        <BodyTd isLast={index !== data.length - 1}>
                          <div className='flex'>
                            <div className='bg-[#323219] px-3 py-1 rounded-lg'>
                              <Typography className='font-light whitespace-nowrap'>{getFunctionFromFunctionId(x.payload.function)}</Typography>
                            </div>
                          </div>
                        </BodyTd>
                        <BodyTd isLast={index !== data.length - 1} leftCorner={index === data.length - 1}>
                          <div className='flex flex-col'>
                            {getAPTTransferAmount(walletAddress, x)}
                            <Typography className='font-light whitespace-nowrap text-sm' color='text-gray-600'>
                              საკომისიო {calculateFee(x)}
                            </Typography>
                          </div>
                        </BodyTd>
                      </BodyTr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <div className='p-2'>
                  <Alert variant='warning' text='ტრანზაქციები არ არის!' />
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
          <LoadingPulse width='full' />
        </div>
      )}
    </div>
  )
}

export default Index
