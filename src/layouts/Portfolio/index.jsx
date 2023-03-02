import Button from 'components/Button'
import Card from 'components/Cards/Card'
import Input from 'components/Input'
import Modal from 'components/Modal'
import Skelaton from 'components/Skelaton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { getCoinData, getSearchCoin } from 'utils/APIs/CoinGeckoAPI'
import { calculateProfitLossAndPercent, calculateCoinProfitPercentAndUSD, calculateInvested, calculatePriceForX } from 'utils/Helpers/PortfolioHelpers'

const Index = () => {
  const [userPortfolio, setUserPortfolio] = useState([])
  const [updateTable, setUpdateTable] = useState(false)
  const [isLoading, setIsLoading] = useState(Boolean)
  const [openModal, setOpenModal] = useState(false)
  const [openModalSearch, setOpenModalSearch] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [tokenData, setTokenData] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [totalInvestedUSD, setTotalInvestedUSD] = useState(0)
  const [calculatorProfit, setCalculatorProfit] = useState([])
  const [currentProfit, setCurrentProfit] = useState(0)
  const toast = useToast()

  const profitCalculator = (type, event) => {
    setCalculatorProfit([])
    const result = calculatePriceForX(type, Number(event.target.value))
    setCalculatorProfit(result)
  }

  const updatePortfolio = async () => {
    const current_total_profit = []
    const userPortfolio = JSON.parse(localStorage.getItem('userPortfolio'))
    setUserPortfolio(userPortfolio)
    setTotalInvestedUSD(calculateInvested())
    if (userPortfolio !== null && Object.keys(userPortfolio).length !== 0) {
      await Promise.all(
        userPortfolio.map(async (x, index) => {
          const getCoinMarketData = await getCoinData(x.data.api_symbol)
          if (getCoinMarketData.status === 200) {
            const current_holding_price = Number(x.quantity) * getCoinMarketData.data.market_data.current_price.usd
            const percentAndUSD = calculateCoinProfitPercentAndUSD(x.price, getCoinMarketData.data.market_data.current_price.usd, x.quantity)
            userPortfolio[index].current_holding_price = current_holding_price
            userPortfolio[index].profitLoss = percentAndUSD
            current_total_profit.push(current_holding_price)
          }
        })
      )
      userPortfolio.sort((a, b) => b.current_holding_price - a.current_holding_price)
      const sumProfit = current_total_profit.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
      setCurrentProfit(sumProfit)
      localStorage.setItem('userPortfolio', JSON.stringify(userPortfolio))
      setTotalInvestedUSD(calculateInvested())
    } else {
      setCurrentProfit(0)
    }
  }

  const setResultTokenData = (coin) => {
    setTokenData(coin)
    setOpenSearch(!openSearch)
    setOpenModal(!openModal)
  }

  const getSearchData = async (e) => {
    const value = e.target.value
    setSearchResult([])
    if (String(value).length >= 2) {
      setIsLoading(true)
      const data = await getSearchCoin(value)
      setSearchResult(data.data.coins)
      setIsLoading(false)
    }
  }

  const deleteAddress = (index) => {
    const userPortfolio = JSON.parse(localStorage.getItem('userPortfolio'))
    userPortfolio.splice(index, 1)
    localStorage.setItem('userPortfolio', JSON.stringify(userPortfolio))
    setUpdateTable(!updateTable)
  }

  const addCoinToPortfolio = async (data) => {
    const coinQuantity = document.getElementById('coinQuantity').value
    const buyPrice = document.getElementById('buyPrice').value
    const getData = await getCoinData(data.api_symbol)
    if (getData.status === 200) {
      const info = { status: 200, data, quantity: coinQuantity, price: buyPrice, invested: Number(coinQuantity) * Number(buyPrice), marketData: getData?.data?.market_data }
      let userPortfolio = JSON.parse(localStorage.getItem('userPortfolio'))
      if (!userPortfolio) {
        userPortfolio = []
      }
      userPortfolio.push(info)
      localStorage.setItem('userPortfolio', JSON.stringify(userPortfolio))
      setOpenModalSearch(!openModalSearch)
      setOpenModal(!openModal)
      setUpdateTable(!updateTable)
    } else {
      toast('error', 'API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით.')
    }
  }

  useEffect(() => {
    updatePortfolio()
    // eslint-disable-next-line
  }, [updateTable])

  return (
    <div>
      <div className='mb-2'>
        <Card title='კალკულატორი' titleBorder={true}>
          <div className='p-2 space-y-2'>
            <div className='flex flex-row items-center gap-2'>
              <Typography className='text-sm'>რამდენი იქნება მოგება თუ ყველამ ATH-დან დადო</Typography>
              <Input onChange={(e) => profitCalculator('ath', e)} placeholder='' className='w-[50px] text-center' />
              <Typography className='text-sm'>X</Typography>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <Typography className='text-sm'>რამდენი იქნება მოგება თუ ყველამ ყიდვის ფასიდან დადო</Typography>
              <Input onChange={(e) => profitCalculator('buyPrice', e)} placeholder='' className='w-[50px] text-center' />
              <Typography className='text-sm'>X</Typography>
            </div>
          </div>
        </Card>
      </div>
      <Card title='პორტფოლიო' titleBorder={true}>
        <div>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col md:flex-row md:items-center justify-between md:gap-2'>
              <div className='p-2'>
                <Typography className='text-sm' color='text-gray-500'>
                  მიმდინარე ბალანსი
                </Typography>
                <Typography className='text-xl font-bold' color='text-white'>
                  ${Number(currentProfit).toLocaleString('en-US')}
                </Typography>
              </div>
              <div className='p-2'>
                <Typography className='text-sm' color='text-gray-500'>
                  გაკეთებული ინვესტიცია
                </Typography>
                <Typography className='text-xl font-bold' color='text-white'>
                  ${Number(totalInvestedUSD).toLocaleString('en-US')}
                </Typography>
              </div>
              <div className='p-2'>
                <Typography className='text-sm' color='text-gray-500'>
                  მოგება/წაგება
                </Typography>
                <div className='flex items-center gap-2'>
                  <Typography className='text-xl font-bold' color='text-white'>
                    ${calculateProfitLossAndPercent(currentProfit, totalInvestedUSD).profitUSD}
                  </Typography>
                  <div className='flex'>
                    <div className={`${calculateProfitLossAndPercent(currentProfit, totalInvestedUSD).percentageProfit > 0 ? 'bg-green-700' : 'bg-red-700'} px-2 py-1 rounded-lg text-center`}>
                      <Typography className='text-xs text-white'>{Number(calculateProfitLossAndPercent(currentProfit, totalInvestedUSD).percentageProfit).toLocaleString('en-US')}%</Typography>
                    </div>
                  </div>
                </div>
              </div>
              {Object.keys(calculatorProfit).length > 0 && (
                <div className='p-2'>
                  <Typography className='text-sm' color='text-gray-500'>
                    დათვილი მოგება
                  </Typography>
                  <div className='flex items-center gap-2'>
                    <Typography className='text-xl font-bold' color='text-white'>
                      ${Number(calculatorProfit.sumProfit).toLocaleString('en-US')}
                    </Typography>
                    <div className='flex'>
                      <div className={`${calculatorProfit.percentageProfit > 0 ? 'bg-green-700' : 'bg-red-700'} px-2 py-1 rounded-lg text-center`}>
                        <Typography className='text-xs text-white'>{Number(calculatorProfit.percentageProfit).toLocaleString('en-US')}%</Typography>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='px-2 mb-2 md:mb-0'>
              <Button onClick={() => setOpenModalSearch(!openModalSearch)}>+ დაამატე</Button>
            </div>
          </div>
          <div className='border-b border-lightBorder'></div>
          <div>
            <Table>
              <Thead>
                <HeadTr>
                  <HeadTh>სახელი</HeadTh>
                  <HeadTh>ფასი</HeadTh>
                  <HeadTh>რაოდენობა</HeadTh>
                  <HeadTh>ყიდვის ფასი</HeadTh>
                  <HeadTh>მოგება/წაგება</HeadTh>
                  <HeadTh>ATH</HeadTh>
                  <HeadTh></HeadTh>
                </HeadTr>
              </Thead>
              <Tbody>
                {userPortfolio?.map((x, index) => (
                  <BodyTr key={index}>
                    <BodyTd isLast={index !== userPortfolio.length - 1} rightCorner={index === userPortfolio.length - 1}>
                      <div className='flex items-center gap-2'>
                        <img src={x.data.large} alt={x.data.name} className='w-8 rounded-full' />
                        <div className='flex flex-col'>
                          <Typography>{x.data.name}</Typography>
                          <Typography className='text-xs text-gray-500'>{x.data.symbol}</Typography>
                        </div>
                      </div>
                    </BodyTd>
                    <BodyTd isLast={index !== userPortfolio.length - 1}>
                      <Typography>${Number(x.marketData?.current_price?.usd).toLocaleString('en-US')}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== userPortfolio.length - 1}>
                      <div className='flex flex-col'>
                        <Typography>${Number(x.current_holding_price).toLocaleString('en-US')}</Typography>
                        <Typography className='text-xs text-gray-500 whitespace-nowrap'>
                          {Number(x.quantity).toLocaleString('en-US')} {x.data.symbol}
                        </Typography>
                      </div>
                    </BodyTd>
                    <BodyTd isLast={index !== userPortfolio.length - 1}>
                      <Typography>${Number(x.price).toLocaleString('en-US')}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== userPortfolio.length - 1} className=''>
                      <div className='flex flex-col'>
                        <Typography>{Number(x?.profitLoss?.profitUSD).toLocaleString('en-US')}$</Typography>
                        <div className='flex'>
                          <div className={`${x?.profitLoss?.profitPercent > 0 ? 'bg-green-700' : 'bg-red-700'} px-2 py-1 rounded-lg text-center`}>
                            <Typography className='text-xs text-white'>{Number(x.profitLoss?.profitPercent).toLocaleString('en-US')}%</Typography>
                          </div>
                        </div>
                      </div>
                    </BodyTd>
                    <BodyTd isLast={index !== userPortfolio.length - 1}>
                      <Typography>${Number(x?.marketData?.ath?.usd).toLocaleString('en-US')}</Typography>
                      <Typography className='text-sm text-gray-500 whitespace-nowrap'>{String(x?.marketData?.ath_date?.usd).slice(0, 10)}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== userPortfolio.length - 1} leftCorner={index === userPortfolio.length - 1}>
                      <div className='flex items-center gap-2'>
                        <AiFillDelete onClick={() => deleteAddress(index)} className='text-red-500 duration-150 hover:scale-110 text-xl' />
                      </div>
                    </BodyTd>
                  </BodyTr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
      </Card>
      <Modal title='აირჩიეთ ქოინი' open={openModalSearch} close={() => setOpenModalSearch(!openModalSearch)}>
        <div className='px-2 mb-2'>
          <Input onChange={(event) => getSearchData(event)} onClick={() => setOpenSearch(!openSearch)} id='coinName' placeholder='ჩაწერეთ ქოინის სახელი' />
          {!isLoading ? (
            <div>
              {searchResult.length > 0 && (
                <div>
                  {openSearch && (
                    <div className='h-[350px] w-full overflow-y-auto rounded-lg mt-2'>
                      <div className='w-full'>
                        <div className=''>
                          {searchResult.map((coin, index) => (
                            <div key={coin.id} onClick={() => setResultTokenData(coin)}>
                              <div className={`p-2 hover:bg-lightHover ${index === searchResult.length - 1 && 'rounded-br-lg'} cursor-pointer`}>
                                <div className={`flex gap-2 items-center`}>
                                  <img src={coin.large} alt={coin.name} className='w-5' />
                                  <Typography className='text-sm'>{coin.name}</Typography>
                                </div>
                              </div>
                              <div className={`${index !== searchResult.length - 1 && 'border-b border-lightHover'}`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <Skelaton width='full' />
            </div>
          )}
        </div>
      </Modal>
      <Modal title='დაამატე პორტფოლიოში' open={openModal} close={() => setOpenModal(!openModal)}>
        <div className='px-2 mb-2'>
          <div className='border-[1px] border-lightBorder gap-2 rounded-lg p-2 hover:bg-lightHover cursor-pointer'>
            <div className='flex items-center gap-2'>
              <img src={tokenData.large} alt={tokenData.name} className='w-8 rounded-full' />
              <div className='flex items-center gap-2'>
                <Typography className='text-sm' color='text-white'>
                  {tokenData.name}
                </Typography>
                <Typography className='text-sm' color='text-gray-500'>
                  {tokenData.symbol}
                </Typography>
              </div>
            </div>
          </div>
          <div className='mt-3'>
            <div className='flex items-center gap-2'>
              <div>
                <Typography className='text-sm mb-1 ml-1'>რაოდენობა</Typography>
                <Input id='coinQuantity' placeholder='0.00' />
              </div>
              <div>
                <Typography className='text-sm mb-1 ml-1'>ფასი</Typography>
                <Input id='buyPrice' placeholder='$0.00' />
              </div>
            </div>
            <div className='mt-2'>
              <Button onClick={() => addCoinToPortfolio(tokenData)}>დამატება</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Index
