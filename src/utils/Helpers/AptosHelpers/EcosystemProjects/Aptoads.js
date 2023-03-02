import axios from 'axios'
import { APTOS_INDEXER } from 'config'
import { getCoinData } from 'utils/APIs/CoinGeckoAPI'
import { getFloorPrice } from 'utils/APIs/TopazAPI'

export const getUserToads = async (address) => {
  const data = JSON.stringify({
    query: `query GetUserTokens($owner_address: String) {
      current_token_ownerships_aggregate(
        where: {collection_name: {_eq: "Aptos Toad Overload"}, owner_address: {_eq: $owner_address}, creator_address: {_eq: "0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52"}, amount: {_eq: "0"}}
        order_by: {name: asc, last_transaction_version: desc}
        distinct_on: name
        offset: 0
        limit: 100
      ) {
        nodes {
          name
          last_transaction_version
        }
      }
    } `,
    variables: { owner_address: address },
  })

  const json = await axios.post(APTOS_INDEXER, data).catch((error) => error.response)
  return json
}

export const getUserStakedHandle = async (address) => {
  const json = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resource/0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::TokensStaked`)
    .then((response) => response)
    .catch((error) => error.response)
  return json
}

export const getUserStakedAptoads = async (address) => {
  const toadsRes = await getUserToads(address)
  const handleRes = await getUserStakedHandle(address)

  if (toadsRes.status !== 200 || Object.keys(toadsRes.data.data.current_token_ownerships_aggregate.nodes).length === 0) {
    return { status: 200, statusId: 'info', statusText: 'არ გაქვთ დასტეიკებული Aptoads' }
  }

  if (handleRes.status !== 200 || Object.keys(handleRes.data.data.tokens_staked).length === 0) {
    if (handleRes.data.error_code === 'resource_not_found') {
      return { status: 200, statusId: 'info', statusText: 'არ გაქვთ დასტეიკებული Aptoads' }
    } else {
      return { status: 404, statusId: 'error', statusText: 'API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით.' }
    }
  }

  const stakedToads = []
  const handle = handleRes.data.data.tokens_staked.handle

  await Promise.all(
    toadsRes.data.data.current_token_ownerships_aggregate.nodes.map(async (toad) => {
      const options = {
        method: 'POST',
        url: `https://fullnode.mainnet.aptoslabs.com/v1/tables/${handle}/item`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          key_type: '0x3::token::TokenId',
          value_type: '0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::TokenStake',
          key: {
            token_data_id: {
              collection: 'Aptos Toad Overload',
              creator: '0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52',
              name: toad.name,
            },
            property_version: '0',
          },
        },
      }
      const res = await axios.request(options).catch((error) => error.response)
      if (res.status !== 404) {
        stakedToads.push(res.data)
      }
    })
  )

  return stakedToads
}

export const getUserStakedAptoadsUSD = async (data) => {
  const getToadsFP = await getFloorPrice('0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52::Aptos Toad Overload')
  const aptFloor = Number(getToadsFP.data.data.floor) / 10 ** 8
  const getAPTPrice = await getCoinData('aptos')
  const aptPrice = getAPTPrice.data.market_data.current_price.usd
  let getStakedToads = null
  if (typeof data === 'string') {
    getStakedToads = await getUserStakedAptoads(data)
  } else {
    getStakedToads = data
  }
  if (!getStakedToads.hasOwnProperty('status')) {
    const numberOfToads = getStakedToads.length
    const AptValue = aptFloor * numberOfToads
    const usdValue = AptValue * aptPrice
    return usdValue
  } else {
    return 0
  }
}
