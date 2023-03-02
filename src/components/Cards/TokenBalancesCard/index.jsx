import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import Card from 'components/Cards/Card'
import Skelaton from 'components/Skelaton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { getExplorerURL } from 'utils/getExplorerURL'

const Index = ({ data, isLoading }) => {
  const { chainId } = useWeb3React()

  return (
    <Card title='ტოკენების ბალანსი' titleBorder={true}>
      <div className='overflow-scroll overflow-x-hidden max-h-[210px]'>
        {!isLoading ? (
          <div>
            {data.status === 200 ? (
              <div>
                {data.data.length > 0 ? (
                  <div>
                    <Table>
                      <Thead>
                        <HeadTr>
                          <HeadTh>სახელი</HeadTh>
                          <HeadTh>სიმბოლო</HeadTh>
                          <HeadTh>ბალანსი</HeadTh>
                        </HeadTr>
                      </Thead>
                      <Tbody>
                        {data.data.map((x, index) => (
                          <BodyTr key={index}>
                            <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                              <div className='flex items-center gap-1'>
                                <a href={getExplorerURL('evm', chainId, 'token', x.tokenAddress)} target='_blank' rel='noreferrer' className='text-lightText'>
                                  {x.name}
                                </a>
                              </div>
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.length - 1}>
                              <a href={getExplorerURL('evm', chainId, 'token', x.tokenAddress)} target='_blank' rel='noreferrer' className='text-lightText'>
                                {x.symbol}
                              </a>
                            </BodyTd >
                            <BodyTd isLast={index !== data.data.length - 1} leftCorner={index === data.data.length - 1}>
                              <Typography>
                                {(Number(x.balance) / 10 ** Number(x.decimals)).toLocaleString('en-US')}
                              </Typography>
                            </BodyTd>
                          </BodyTr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                ) : (
                  <div className='p-2'>
                    <Alert variant='info' text='ბალანსზე ტოკენები არ გაქვთ' />
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
    </Card>
  )
}

export default Index
