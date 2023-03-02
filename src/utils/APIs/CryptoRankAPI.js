import axios from 'axios'
import moment from 'moment'

export const getGlobalDataCR = async () => {
  const json = await axios(`https://api.cryptorank.io/v0/global`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getVCsData = async () => {
  const json = await axios(`https://api.cryptorank.io/v0/coin-funds?withSummary=true`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getVCData = async (slug) => {
  const json = await axios(`https://api.cryptorank.io/v0/coin-funds/by-slug/${slug}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getVCInvestments = async (vcId) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins?fundIds=${vcId}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getMostSearched = async () => {
  const today = moment().subtract(1, 'days').format('YYYY-MM-DD')
  const json = await axios(`https://api.cryptorank.io/v0/coins/trending/by-views?dateFrom=${today}&limit=10&locale=en`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200) {
    const outputList = json.data.data.map(({ rank, key, name, symbol, image, price }) => ({
      token_rank: rank,
      token_key: key,
      token_name: name,
      token_symbol: symbol,
      token_logo: image.native,
      token_price: price ? (price.hasOwnProperty('USD') ? `$${Number(price.USD).toLocaleString('en-US')}` : undefined) : undefined,
      token_link: `https://cryptorank.io/price/${key}`,
    }))
    return {
      status: true,
      error: false,
      data: outputList,
    }
  } else {
    return {
      status: false,
      error: true,
      data: [],
    }
  }
}

export const getCoinMarketCap = async (id) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins/${id}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getTopGainers = async (length) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins?specialFilter=topGainersFor24h&limit=${length}`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    const outputList = json.data.data.map(({ key, symbol, name, image, price, rank }) => ({
      token_rank: rank,
      token_key: key,
      token_name: name,
      token_symbol: symbol,
      token_logo: image.native,
      token_price: price.hasOwnProperty('USD') ? `$${Number(price.USD).toLocaleString('en-US')}` : undefined,
      token_link: `https://cryptorank.io/price/${key}`,
    }))
    return {
      status: true,
      error: false,
      data: outputList,
    }
  } else {
    return {
      status: false,
      error: true,
      data: [],
    }
  }
}

export const getTopLosers = async (length) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins?specialFilter=topLosersFor24h&limit=${length}`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200) {
    const outputList = json.data.data.map(({ key, symbol, name, image, price, rank }) => ({
      token_rank: rank,
      token_key: key,
      token_name: name,
      token_symbol: symbol,
      token_logo: image.native,
      token_price: price.hasOwnProperty('USD') ? `$${Number(price.USD).toLocaleString('en-US')}` : undefined,
      token_link: `https://cryptorank.io/price/${key}`,
    }))
    return {
      status: true,
      error: false,
      data: outputList,
    }
  } else {
    return {
      status: false,
      error: true,
      data: [],
    }
  }
}

export const getNewATH = async (length) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins?specialFilter=newAth&minUsdVolume=75000&limit=${length}`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200) {
    const outputList = json.data.data.map(({ key, symbol, name, image, price, rank }) => ({
      token_rank: rank,
      token_key: key,
      token_name: name,
      token_symbol: symbol,
      token_logo: image.native,
      token_price: price.hasOwnProperty('USD') ? `$${Number(price.USD).toLocaleString('en-US')}` : undefined,
      token_link: `https://cryptorank.io/price/${key}`,
    }))
    return {
      status: true,
      error: false,
      data: outputList,
    }
  } else {
    return {
      status: false,
      error: true,
      data: [],
    }
  }
}

export const getNewATL = async (length) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins?specialFilter=newAtl&minUsdVolume=75000&limit=${length}`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200) {
    const outputList = json.data.data.map(({ key, symbol, name, image, price, rank }) => ({
      token_rank: rank,
      token_key: key,
      token_name: name,
      token_symbol: symbol,
      token_logo: image.native,
      token_price: price.hasOwnProperty('USD') ? `$${Number(price.USD).toLocaleString('en-US')}` : undefined,
      token_link: `https://cryptorank.io/price/${key}`,
    }))
    return {
      status: true,
      error: false,
      data: outputList,
    }
  } else {
    return {
      status: false,
      error: true,
      data: [],
    }
  }
}

export const getStablecoins = async (length) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins?categoryIds=37`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCoinPriceID = async (id) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins/${id}?locale=en`)
    .then((response) => response)
    .catch((error) => error.response)
  if (json.status === 200) {
    return json.data.data.price.USD
  } else {
    return 0
  }
}

export const getCRMonthlyHistory = async (id) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins/${id}/monthly-history`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCRQuarterlyHistory = async (id) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins/${id}/quarterly-history`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getCRYearlyHistory = async (id) => {
  const json = await axios(`https://api.cryptorank.io/v0/coins/${id}/yearly-history`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}