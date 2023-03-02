import React, { useState, useEffect } from 'react'
import Card from 'components/Cards/Card'
import { getBitcoin, getGreedIndex } from 'utils/APIs/CryptoLuxAPI'
import Circle from './SemiCircle'
import Alert from 'components/Alerts'
import Skelaton from 'components/Skelaton'

const Index = () => {
  const [isLoading, setIsLoading] = useState(Boolean)
  const [btcIndex, setBtcIndex] = useState([])
  const [bitcoinData, setBitcoinData] = useState([])

  const words = { Greed: 'სიხარბე', Fear: 'შიში', Neutral: 'ნეიტრალური' }
  const wordsColor = { Greed: 'text-green-500', Fear: 'text-red-500', Neutral: 'text-yellow-500' }
  const months = { 1: 'ინვარი', 2: 'თებერვალი', 3: 'მარტი', 4: 'აპრილი', 5: 'მაისი', 6: 'ივნისი', 7: 'ივლისი', 8: 'აგვისტო', 9: 'სექტემბერი', 10: 'ოქტომბერი', 11: 'ნოემბერი', 12: 'დეკემბერი' }

  const getDate = (date) => {
    const splitText = String(date).split(' ')[0]
    const getDay = splitText.split('-')[2]
    const getMonth = splitText.split('-')[1]
    return `${getDay} ${months[Number(getMonth)]}`
  }

  const fetchData = async () => {
    setIsLoading(true)
    const greedIndex = await getGreedIndex()
    setBtcIndex(greedIndex)
    const btc = await getBitcoin()
    setBitcoinData(btc)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Card title='Bitcoin Fear & Greed Index' titleBorder={true}>
        <div>
          {!isLoading ? (
            <div>
              {btcIndex.status === 200 ? (
                <div>
                  <div className='flex items-center justify-center mt-3'>
                    <Circle value={Number(btcIndex.data.data[0].value)} />
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  <div className=''>
                    {bitcoinData.status === 200 && bitcoinData.data.status === true ? (
                      <div>
                        <div className='p-2 space-y-2'>
                          <div className={`${Number(bitcoinData.data.data.price_change) > 0 ? 'bg-green-900 border-[1px] border-green-600' : 'bg-red-900 border-[1px] border-red-600'} p-1 gap-2 rounded-md text-white text-sm flex items-center`}>
                            <p className='text-sm text-white'>ფასი: ${Number(bitcoinData.data.data.price).toLocaleString('en-US')}</p>
                            <div className={`${Number(bitcoinData.data.data.price_change) > 0 ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded-lg`}>{bitcoinData.data.data.price_change}%</div>
                          </div>
                          <div className={`${Number(bitcoinData.data.data.market_cap_change) > 0 ? 'bg-green-900 border-[1px] border-green-600' : 'bg-red-900 border-[1px] border-red-600'} p-1 gap-2 rounded-md text-white text-sm flex items-center`}>
                            <p className='text-sm text-white'>კაპ: ${Number(bitcoinData.data.data.market_cap).toLocaleString('en-US')}</p>
                            <div className={`${Number(bitcoinData.data.data.market_cap_change) > 0 ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded-lg`}>{bitcoinData.data.data.market_cap_change}%</div>
                          </div>
                          <div className={`${Number(bitcoinData.data.data.volume_change) > 0 ? 'bg-green-900 border-[1px] border-green-600' : 'bg-red-900 border-[1px] border-red-600'} p-1 gap-2 rounded-md text-white text-sm flex items-center`}>
                            <p className='text-sm text-white'>ნავაჭრი: ${Number(bitcoinData.data.data.volume).toLocaleString('en-US')}</p>
                            <div className={`${Number(bitcoinData.data.data.volume_change) > 0 ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded-lg`}>{bitcoinData.data.data.volume_change}%</div>
                          </div>
                        </div>
                        <div className='border-[1px] border-b border-lightBorder'></div>
                      </div>
                    ) : (
                      <div className='p-2'>
                        <Alert variant='error' text='CMC API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
                      </div>
                    )}
                    {btcIndex.data.data.map((x, index) => (
                      <div key={index}>
                        <div className={`flex items-center p-2 gap-1 hover:bg-lightHover ${index === 5 && 'rounded-b-lg'}`}>
                          <p className='text-lightText text-sm'>{getDate(x.date)}:</p>
                          <p className={`${wordsColor[x.value_classification]} text-sm`}>
                            {Number(x.value)} {words[x.value_classification]}
                          </p>
                        </div>
                        {index !== 5 && <div className='border-[1px] border-b border-lightBorder'></div>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='p-2'>
                  <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით!' />
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
    </div>
  )
}

export default Index
