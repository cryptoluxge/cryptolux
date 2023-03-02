import axios from 'axios'
import { mainnetTokens } from 'config/APTOS/mainnetTokens'

export const getGlobalData = async () => {
  const json = await axios(`https://api.coingecko.com/api/v3/global`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCGTrendingCoins = async () => {
  const json = await axios(`https://api.coingecko.com/api/v3/search/trending`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200) {
    const outputList = json.data.coins.map((x) => ({ token_name: x.item.name, token_symbol: x.item.symbol, token_link: `https://www.coingecko.com/en/coins/${x.item.slug}`, token_logo: x.item.large, id: x.item.id, token_price: undefined }))
    const finalOutput = {
      status: true,
      error: false,
      data: outputList,
    }
    return finalOutput
  } else {
    return {
      status: false,
      error: true,
      data: [],
    }
  }
}

export const getCGDeFiData = async () => {
  const json = await axios(`https://api.coingecko.com/api/v3/global/decentralized_finance_defi`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getTopCoins = async () => {
  const json = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getSimpleCoinPrice = async (id) => {
  const json = await axios(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCoinData = async (id) => {
  const json = await axios(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getTokensPrice = async (tokens) => {
  var tokensList = []
  var tokensUSDList = []
  var value = 0
  if (Object.keys(tokens).length > 0) {
    if (tokens.status === 200) {
      if (Object.keys(tokens.data.data.current_coin_balances).length > 0) {
        tokens.data.data.current_coin_balances.forEach((x) => {
          if (x.coin_type !== '0x1::aptos_coin::AptosCoin' && x.amount > 0) {
            mainnetTokens.forEach((y) => {
              if (x.coin_type === y.token_type.type && y.coingecko_id !== '') {
                tokensList.push({ coingeckoId: y.coingecko_id, type: x.coin_type, name: x.coin_info.name, symbol: x.coin_info.symbol, amount: Number(x.amount) / 10 ** x.coin_info.decimals })
              }
            })
          }
        })
      }
    }
  }

  if (Object.keys(tokensList).length > 0) {
    await Promise.all(
      tokensList.map(async (x) => {
        const getPrice = await getCoinData(x.coingeckoId)
        if (getPrice.status === 200) {
          tokensUSDList.push(getPrice.data.market_data.current_price.usd * x.amount)
        }
      })
    )
    value = tokensUSDList.reduce(function (a, b) {
      return a + b
    })
  }

  return value
}

export const convertAptToUSD = async (balance) => {
  const getAptPrice = await getCoinData('aptos')
  const aptPrice = getAptPrice.data.market_data.current_price.usd
  if (Object.keys(balance).length > 0) {
    if (balance.status === 200) {
      if (Object.keys(balance.data[0]).length > 0) {
        const result = Number(aptPrice) > 0 ? Number(balance.data[0].balance) * Number(aptPrice) : 0
        return result
      } else {
        return 0
      }
    } else {
      return 0
    }
  }
}

export const getCoinByPlatformAndAddress = async (platform, address) => {
  const json = await axios(`https://api.coingecko.com/api/v3/coins/${platform}/contract/${address}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCoinList = async () => {
  const json = await axios(`https://api.coingecko.com/api/v3/coins/list`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCoinDataFromList = async (id) => {
  const list = await getCoinList()

  if (list.status === 200) {
    const coinData = list.data.find((x) => String(x.symbol).toLocaleLowerCase() === String(id).toLocaleLowerCase())
    if (coinData) {
      return { status: 200, data: coinData }
    }
  }

  return { status: 404, data: '' }
}

export const getSearchCoin = async (coin) => {
  const json = await axios(`https://api.coingecko.com/api/v3/search?query=${coin}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}
