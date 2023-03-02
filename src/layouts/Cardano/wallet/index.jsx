import AddressBookButton from 'components/AddresBookButton'
import Alerts from 'components/Alerts'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import MiniCard from 'components/Cards/MiniCard'
import Input from 'components/Input'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { BsPiggyBankFill } from 'react-icons/bs'
import { GiToken } from 'react-icons/gi'
import { MdAccountBalanceWallet, MdSwapHorizontalCircle } from 'react-icons/md'
import { getWallet } from 'utils/APIs/CardanoAPI'
import { getCoinPriceID } from 'utils/APIs/CryptoRankAPI'
import { getCoinByPlatformAndAddress, getCoinData, getCoinDataFromList } from 'utils/APIs/CoinGeckoAPI'

const Index = () => {
  const [adaPrice, setAdaPrice] = useState([])
  const [walletData, setWalletData] = useState([])
  const [walletNFTs, setWalletNFTs] = useState([])
  const [walletTokens, setWalletTokens] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const getWalletData = async () => {
    setIsLoading(true)
    const address = document.getElementById('walletAddress').value
    if (address === '') {
      toast('error', 'გთხოვთ, შეიყვანოთ მისამართი!')
    } else {
      const data = await getWallet(address)
      setWalletData(data)
      if (data.status === 200) {
        if (data.data.tokens.length > 0) {
          const tokens = data.data.tokens.filter((item) => item.hasOwnProperty('decimals'))
          await Promise.all(
            tokens.map(async (x, index) => {
              const getPrice = await getCoinByPlatformAndAddress('cardano', x.policy)
              if (getPrice.status === 200) {
                const currentPrice = getPrice.data.market_data.current_price.usd
                const balance = x.quantity / 10 ** x.decimals
                const totalUSD = currentPrice * balance
                tokens[index].price = currentPrice
                tokens[index].valueUSD = totalUSD
              } else if (getPrice.status === 404 && getPrice.data.error === 'coin not found') {
                const getCoin = await getCoinData(String(x.name).toLocaleLowerCase())
                if (getCoin.status === 200 && getCoin.data.asset_platform_id === 'cardano') {
                  const currentPrice = getCoin.data.market_data.current_price.usd
                  const balance = x.quantity / 10 ** x.decimals
                  const totalUSD = currentPrice * balance
                  tokens[index].price = currentPrice
                  tokens[index].valueUSD = totalUSD
                } else {
                  const testData = await getCoinDataFromList(x.metadata.ticker)
                  if (testData.status === 200) {
                    const getCoin = await getCoinData(String(testData.data.id).toLocaleLowerCase())
                    const currentPrice = getCoin.data.market_data.current_price.usd
                    const balance = x.quantity / 10 ** x.decimals
                    const totalUSD = currentPrice * balance
                    tokens[index].price = currentPrice
                    tokens[index].valueUSD = totalUSD
                  }
                }
              }
            })
          )
          setWalletTokens(tokens)
          setWalletNFTs(data.data.tokens.filter((item) => !item.hasOwnProperty('decimals')))
          const getAdaPrice = await getCoinPriceID('cardano')
          setAdaPrice(getAdaPrice)
        } else {
          setWalletTokens([])
          setWalletNFTs([])
        }
      }
    }
    setIsLoading(false)
  }

  const ipfsToUrl = (tokenURI) => {
    if (String(tokenURI).startsWith('ipfs://')) {
      const url = String(tokenURI).replace('ipfs://', 'https://infura-ipfs.io/ipfs/')
      return url
    } else {
      return tokenURI
    }
  }

  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-full md:w-[500px]'>
          <Card title='Cardano-ს საფულის შემოწმება' titleBorder={true}>
            <div className='p-2'>
              <div className='flex items-center gap-2'>
                <Input type='text' name='cardanoWallet' id='walletAddress' placeholder='შეიყვანეთ საფულის მისამართი' />
                <AddressBookButton />
              </div>
              <div className='mt-2'>
                <Button onClick={() => getWalletData()} loading={isLoading}>
                  შემოწმება
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div>
        {isLoading === false ? (
          <div>
            {walletData.status === 200 ? (
              <div>
                {Object.keys(walletData).length > 0 ? (
                  <div>
                    <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full mt-4'>
                      <MiniCard title='ბალანსი' data={`${walletData.data.lovelaces / 10 ** 6} ($${((walletData.data.lovelaces / 10 ** 6) * adaPrice).toLocaleString('en-US')})`} icon={<MdAccountBalanceWallet className='text-white text-4xl' />} />
                      <MiniCard title='სტეიკზეა' data={walletData.data.pool ? 'კი' : 'არა'} icon={<BsPiggyBankFill className='text-white text-4xl' />} />
                      <MiniCard title='UTXOs' data={walletData.data.utxos} icon={<MdSwapHorizontalCircle className='text-white text-4xl' />} />
                      <MiniCard title='ტოკენები & NFT' data={walletData.data.tokens.length > 0 ? walletData.data.tokens.length : '0'} icon={<GiToken className='text-white text-4xl' />} />
                    </div>
                    <div className='grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-2'>
                      <div>
                        <Card title='ტოკენების ბალანსი' variant='collapsible'>
                          <div className='overflow-y-auto rounded-lg'>
                            {walletTokens.length > 0 ? (
                              <Table>
                                <Thead>
                                  <HeadTr>
                                    <HeadTh>სახელი</HeadTh>
                                    <HeadTh>სიმბოლო</HeadTh>
                                    <HeadTh>ბალანსი</HeadTh>
                                  </HeadTr>
                                </Thead>
                                <Tbody>
                                  {walletTokens.map((x, index) => (
                                    <BodyTr key={x.fingerprint}>
                                      <BodyTd isLast={index !== walletTokens.length - 1} rightCorner={index === walletTokens.length - 1}>
                                        <div className='flex items-center gap-2'>
                                          <Avatar src={x.metadata?.image} alt={x.metadata?.name} className='w-8 rounded-full' />
                                          <Typography>{x.metadata?.name}</Typography>
                                        </div>
                                      </BodyTd>
                                      <BodyTd isLast={index !== walletTokens.length - 1}>
                                        <Typography>{x.metadata?.ticker}</Typography>
                                      </BodyTd>
                                      <BodyTd isLast={index !== walletTokens.length - 1} leftCorner={index === walletTokens.length - 1}>
                                        <Typography>
                                          {(x.quantity / 10 ** x.decimals).toLocaleString('en-US')} {x.hasOwnProperty('valueUSD') && `($${Number(x.valueUSD).toLocaleString('en-US')})`}
                                        </Typography>
                                      </BodyTd>
                                    </BodyTr>
                                  ))}
                                </Tbody>
                              </Table>
                            ) : (
                              <div className='p-2'>
                                <Alerts variant='info' text='საფულეზე ტოკენები არ არის.' />
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                      <div>
                        <Card title='NFT ბალანსი' variant='collapsible'>
                          <div className='overflow-y-auto rounded-lg'>
                            {walletNFTs.length > 0 ? (
                              <div>
                                <Table>
                                  <Thead>
                                    <HeadTr>
                                      <HeadTh>სახელი</HeadTh>
                                      <HeadTh>ბალანსი</HeadTh>
                                    </HeadTr>
                                  </Thead>
                                  <Tbody>
                                    {walletNFTs.map((x, index) => (
                                      <BodyTr key={x.fingerprint}>
                                        <BodyTd isLast={index !== walletNFTs.length - 1} rightCorner={index === walletNFTs.length - 1}>
                                          <div className='flex items-center gap-2'>
                                            <Avatar src={ipfsToUrl(x.metadata?.image)} alt={x.metadata?.name} className='w-8 rounded-full' />
                                            <Typography>{x.metadata?.name}</Typography>
                                          </div>
                                        </BodyTd>
                                        <BodyTd isLast={index !== walletNFTs.length - 1} leftCorner={index === walletNFTs.length - 1}>
                                          <Typography>{x.quantity}</Typography>
                                        </BodyTd>
                                      </BodyTr>
                                    ))}
                                  </Tbody>
                                </Table>
                              </div>
                            ) : (
                              <div className='p-2'>
                                <Alerts variant='info' text='საფულეზე NFT არ არის.' />
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className='mt-2'>
                {walletData.status && (
                  <div>
                    {walletData.data.error === '404 Not Found: invalid receive address' || walletData.data.error === '404 Not Found: address format not supported' ? (
                      <div>
                        <Alerts variant='error' text='საფულის მისამართ არასწორია!' />
                      </div>
                    ) : (
                      <div>
                        <Alerts variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით.' />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Index
