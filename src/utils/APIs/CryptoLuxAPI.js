import axios from 'axios'

export const getCMCTrending = async () => {
  const json = await axios(`${process.env.REACT_APP_API_URL}/cmc/trending`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    return json.data
  } else {
    return { status: false }
  }
}

export const getCGTrending = async () => {
  const json = await axios(`${process.env.REACT_APP_API_URL}/cg/trending`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    return json.data
  } else {
    return { status: false }
  }
}

export const getCGGainersLosers = async () => {
  const json = await axios(`${process.env.REACT_APP_API_URL}/cg/gainers-losers`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    return json.data
  } else {
    return { status: false }
  }
}

export const getCMCGainersLosers = async () => {
  const json = await axios(`${process.env.REACT_APP_API_URL}/cmc/gainers-losers`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    return json.data
  } else {
    return { status: false }
  }
}

export const getGreedIndex = async () => {
  const json = await axios(`${process.env.REACT_APP_API_URL}/fear-greed-index`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    return json
  } else {
    return { status: false }
  }
}

export const getBitcoin = async () => {
  const json = await axios(`${process.env.REACT_APP_API_URL}/cmc/bitcoin`)
    .then((response) => response)
    .catch((error) => error.response)

  if (json.status === 200) {
    return json
  } else {
    return { status: false }
  }
}
