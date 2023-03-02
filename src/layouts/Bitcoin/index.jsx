import BitcoinIndex from 'components/BitcoinFearGreed'
import Card from 'components/Cards/Card'
import Alert from 'components/Alerts'
import Skelaton from 'components/Skelaton'
import { useEffect, useState } from 'react'
import { getBitcoin } from 'utils/APIs/CryptoLuxAPI'
import { getCRMonthlyHistory, getCRQuarterlyHistory } from 'utils/APIs/CryptoRankAPI'
import StatsCard from './StatsCard'

const Index = () => {
  const [btcMonthly, setBtcMonthly] = useState([])
  const [btcQuarterly, setBtcQuarterly] = useState([])
  const [btcData, setBtcData] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean)

  const fetchData = async () => {
    setIsLoading(true)
    const getBtcData = await getBitcoin()
    setBtcData(getBtcData)

    const getBtcMonthly = await getCRMonthlyHistory('bitcoin')
    setBtcMonthly(getBtcMonthly)

    const getBtcQuarterly = await getCRQuarterlyHistory('bitcoin')
    setBtcQuarterly(getBtcQuarterly)
    setIsLoading(false)
  }

  const calc = (num1, num2) => {
    const percentageDifference = ((num2 - num1) / num1) * 100
    return Number(percentageDifference).toFixed(2)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 w-full mb-2'>
        <StatsCard isLoading={isLoading} isError={btcData.status === 200 && btcData.data.status} title='ფასი' percent={btcData?.data?.data?.price_change} data={btcData?.data?.data?.price} />
        <StatsCard isLoading={isLoading} isError={btcData.status === 200 && btcData.data.status} title='კაპიტალიზაცია' percent={btcData?.data?.data?.market_cap_change} data={btcData?.data?.data?.market_cap} />
        <StatsCard isLoading={isLoading} isError={btcData.status === 200 && btcData.data.status} title='ნავაჭრი' percent={btcData?.data?.data?.volume_change} data={btcData?.data?.data?.volume} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
        <BitcoinIndex />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 mt-2'>
        <div>
          <Card title='Bitcoin Quarterly Returns (USD)' titleBorder={true}>
            {!isLoading ? (
              <div className='overflow-y-auto'>
                {btcQuarterly.status === 200 ? (
                  <div className='overflow-y-auto'>
                    <table className='table-auto w-full text-sm text-left '>
                      <thead className='text-gray-500 text-xs'>
                        <tr>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3 '>
                            წელი
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q1
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q2
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q3
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q4
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {btcQuarterly.data.data.reverse().map((year) => {
                          let q1 = year.q1 ? calc(year.q1.openUSD, year.q1.closeUSD) : '-'
                          let q2 = year.q2 ? calc(year.q2.openUSD, year.q2.closeUSD) : '-'
                          let q3 = year.q3 ? calc(year.q3.openUSD, year.q3.closeUSD) : '-'
                          let q4 = year.q4 ? calc(year.q4.openUSD, year.q4.closeUSD) : '-'
                          return (
                            <tr key={year.year} className='w-full cursor-pointer duration-150 hover:bg-lightHover'>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{year.year}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText ${q1 === '-' ? '' : Number(q1) > 0 ? 'bg-green-900' : 'bg-red-900'}`}>{q1 === '-' ? '-' : `${q1}%`}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText ${q2 === '-' ? '' : Number(q2) > 0 ? 'bg-green-900' : 'bg-red-900'}`}>{q2 === '-' ? '-' : `${q2}%`}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText ${q3 === '-' ? '' : Number(q3) > 0 ? 'bg-green-900' : 'bg-red-900'}`}>{q3 === '-' ? '-' : `${q3}%`}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText ${q4 === '-' ? '' : Number(q4) > 0 ? 'bg-green-900' : 'bg-red-900'}`}>{q4 === '-' ? '-' : `${q4}%`}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='p-2'>
                    <Alert variant='error' text='API კავშირი ვერ მოხერხდა ცადეთ მოგვიანებით!' />
                  </div>
                )}
              </div>
            ) : (
              <div className='p-2'>
                <Skelaton width='full' />
              </div>
            )}
          </Card>
        </div>
        <div>
          <Card title='Bitcoin Closing Price (USD) - Quarterly' titleBorder={true}>
            {!isLoading ? (
              <div>
                {btcQuarterly.status === 200 ? (
                  <div className='overflow-y-auto'>
                    <table className='table-auto w-full text-sm text-left '>
                      <thead className='text-gray-500 text-xs'>
                        <tr>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3 '>
                            წელი
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q1
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q2
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q3
                          </th>
                          <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                            Q4
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {btcQuarterly.data.data.map((year) => {
                          let q1 = year.q1 ? `$${Number(year.q1.closeUSD).toLocaleString('en-US')}` : '-'
                          let q2 = year.q2 ? `$${Number(year.q2.closeUSD).toLocaleString('en-US')}` : '-'
                          let q3 = year.q3 ? `$${Number(year.q3.closeUSD).toLocaleString('en-US')}` : '-'
                          let q4 = year.q4 ? `$${Number(year.q4.closeUSD).toLocaleString('en-US')}` : '-'
                          return (
                            <tr key={year.year} className='w-full cursor-pointer duration-150 hover:bg-lightHover'>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{year.year}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{q1}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{q2}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{q3}</td>
                              <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{q4}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='p-2'>
                    <Alert variant='error' text='API კავშირი ვერ მოხერხდა ცადეთ მოგვიანებით!' />
                  </div>
                )}
              </div>
            ) : (
              <div className='p-2'>
                <Skelaton width='full' />
              </div>
            )}
          </Card>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 w-full mt-2 mb-2'>
        <Card title='Bitcoin Monthly Return' titleBorder={true}>
          {!isLoading ? (
            <div className='overflow-y-auto'>
              {btcMonthly.status === 200 ? (
                <div className='overflow-y-auto'>
                  <table className='border-collapse table-auto w-full text-sm text-left'>
                    <thead className='text-gray-500 text-xs'>
                      <tr>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3 '>
                          წელი
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          იან
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          თებ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          მარ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          აპრ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          მაი
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          ივნ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          ივლ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          აგვ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          სექ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          ოქტ
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          ნოე
                        </th>
                        <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
                          დეკ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(btcMonthly.data.data)
                        .reverse()
                        .map((year) => (
                          <tr key={year} className='w-full cursor-pointer duration-150 hover:bg-lightHover'>
                            <td className={`duration-150 border border-lightBorder px-6 py-4 text-lightText`}>{year}</td>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <td
                                key={Math.random(0, 99)}
                                className={`duration-150 border border-lightBorder px-6 py-4 text-white ${
                                  month in btcMonthly.data.data[year].months ? (calc(btcMonthly.data.data[year].months[month].openUSD, btcMonthly.data.data[year].months[month].closeUSD) > 0 ? 'bg-green-900' : 'bg-red-900') : ''
                                }`}>
                                {month in btcMonthly.data.data[year].months ? `${calc(btcMonthly.data.data[year].months[month].openUSD, btcMonthly.data.data[year].months[month].closeUSD)}%` : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='p-2'>
                  <Alert variant='error' text='API კავშირი ვერ მოხერხდა ცადეთ მოგვიანებით!' />
                </div>
              )}
            </div>
          ) : (
            <div className='p-2'>
              <Skelaton width='full' />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Index
