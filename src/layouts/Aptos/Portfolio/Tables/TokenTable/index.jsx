import Alert from 'components/Alerts'
import Skelaton from 'components/Skelaton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import SendButton from './SendButton'

const index = ({ data, isLoading }) => {
  return (
    <div>
      {!isLoading ? (
        <div>
          {data.status === 200 ? (
            <div>
              {!data.data.hasOwnProperty('error') ? (
                <div>
                  {data.data.data.current_coin_balances.length > 0 ? (
                    <Table>
                      <Thead>
                        <HeadTr>
                          <HeadTh>#</HeadTh>
                          <HeadTh>სახელი</HeadTh>
                          <HeadTh>ბალანსი</HeadTh>
                          <HeadTh></HeadTh>
                        </HeadTr>
                      </Thead>
                      <Tbody>
                        {data.data.data.current_coin_balances.map((x, index) => (
                          <BodyTr key={index}>
                            <BodyTd isLast={index !== data.data.data.current_coin_balances.length - 1} rightCorner={index === data.data.data.current_coin_balances.length - 1}>
                              <Typography>
                                {index + 1}
                              </Typography>
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.data.current_coin_balances.length - 1}>
                              <Typography>{x.coin_info.name}</Typography>
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.data.current_coin_balances.length - 1}>
                              <Typography>{(x.amount / 10 ** x.coin_info.decimals).toFixed(8)}</Typography>
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.data.current_coin_balances.length - 1} leftCorner={index === data.data.data.current_coin_balances.length - 1}>
                              <div className='w-28'>
                                <SendButton data={x} disabled={x.amount === 0 ? true : false} />
                              </div>
                            </BodyTd>
                          </BodyTr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <div className='p-2'>
                      <Alert variant='info' text='ბალანსზე ტოკენები არ გაქვთ.' />
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
  )
}

export default index