import axios from 'axios'
import { getCoinData } from './CoinGeckoAPI'

export const getFloorPrice = async (id) => {
  const options = {
    method: 'POST',
    url: 'https://api-v1.topaz.so/api/floor',
    headers: { 'Content-Type': 'application/json' },
    data: {
      collection_id: id,
    },
  }
  const fp = await axios.request(options).catch((error) => error.response)
  return fp
}

export const getNFTsUsdValue = async (nfts) => {

  var nftsFp = []
  var usd = 0
  if (Object.keys(nfts).length > 0) {
    if (nfts.status === 200) {
      await Promise.all(
        nfts.data[0].data.map(async (x) => {
          const data = await getFloorPrice(`${x.current_token_data.creator_address}::${x.current_token_data.collection_name}`)
          if (data.status === 200 && data.data.status === 200 && data.data.error === null) {
            const fp = data.data.data.floor / 10 ** 8
            nftsFp.push(fp)
          } else {
            nftsFp.push(0)
          }
        })
      )
    }
  }

  const getAptPrice = await getCoinData('aptos')
  const aptPrice = getAptPrice.data.market_data.current_price.usd
  if (Object.keys(nftsFp).length > 0) {
    usd = nftsFp.reduce(function (a, b) {
      return a + b
    })
  }
  return usd > 0 ? usd * aptPrice : 0
}

export const getWalletNFTsBalance = async (walletAddress) => {
  const json = await axios(`https://api-v1.topaz.so/api/profile-data?owner=${walletAddress}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}
