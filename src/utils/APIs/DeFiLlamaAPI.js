import axios from 'axios'

export const getProtocols = async () => {
  const json = await axios(`https://api.llama.fi/protocols`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getProtocolWithID = async (id) => {
  const json = await axios(`https://api.llama.fi/protocol/${id}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getTotalTVLChart = async (id) => {
  const json = await axios(`https://api.llama.fi/charts`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getTVLWithID = async (id) => {
  const json = await axios(`https://api.llama.fi/charts/${id}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getProtocolTVL = async (id) => {
  const json = await axios(`https://api.llama.fi/tvl/${id}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getChainsTVL = async () => {
  const json = await axios(`https://api.llama.fi/chains`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getStablecoins = async () => {
  const json = await axios(`https://stablecoins.llama.fi/peggeds`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}
