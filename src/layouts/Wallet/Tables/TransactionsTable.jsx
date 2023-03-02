import Alert from 'components/Alerts'
import AddressComponent from 'components/CryptoComponents/AddressComponent'
import Loading from 'components/Skelaton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { getChainDataById } from 'utils/WalletHelpers'

const TransactionsTable = ({ data, chainId, isTxLoading }) => {
  return (
    <div className='grid grid-cols-1 w-full'>
      {!isTxLoading ? (
        <div>
          {data.status === 200 ? (
            <div>
              {data.data.result.length > 0 ? (
                <div>
                  <Table>
                    <Thead>
                      <HeadTr>
                        <HeadTh>ჰეში</HeadTh>
                        <HeadTh>ბლოკი</HeadTh>
                        <HeadTh>დრო</HeadTh>
                        <HeadTh>საიდან</HeadTh>
                        <HeadTh>სად</HeadTh>
                        <HeadTh>რაოდენობა</HeadTh>
                      </HeadTr>
                    </Thead>
                    <Tbody>
                      {data.data.result.map((tx, index) => (
                        <BodyTr key={index}>
                          <BodyTd isLast={index !== data.data.result.length - 1} rightCorner={index === data.data.result.length - 1}>
                            <AddressComponent address={tx.hash} chain='evm' chainId={chainId} type='tx' />
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.result.length - 1}>
                            <Typography>{tx.block_number}</Typography>
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.result.length - 1}>
                            <Typography className='whitespace-nowrap'>{String(tx.block_timestamp).replace('T', ' ').replace('.000Z', '')}</Typography>
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.result.length - 1}>
                            <AddressComponent address={tx.from_address} chain='evm' chainId={chainId} type='wallet' />
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.result.length - 1}>
                            <AddressComponent address={tx.to_address} chain='evm' chainId={chainId} type='wallet' />
                          </BodyTd>
                          <BodyTd isLast={index !== data.data.result.length - 1} leftCorner={index === data.data.result.length - 1}>
                            <Typography className='whitespace-nowrap'>{(Number(tx.value) / 10 ** 18).toFixed(5)} {getChainDataById(chainId).coinSymbol}</Typography>
                          </BodyTd>
                        </BodyTr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              ) : (
                <div className='p-2'>
                  <Alert variant='info' text='ტრანზაქციები არ გაქვთ!' />
                </div>
              )}
            </div>
          ) : (
            <div className='p-2'>
              <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
            </div>
          )}
        </div>
      ) : (
        <div className='p-2'>
          <Loading width='full' />
        </div>
      )}
    </div>
  )
}

export default TransactionsTable