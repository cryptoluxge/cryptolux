import axios from 'axios'

export const getWallet = async (address) => {
  const json = await axios(`https://pool.pm/wallet/${address}`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}
