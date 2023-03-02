import axios from 'axios'

export const getUserNFTActivity = async (account) => {
  const json = fetch('https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query getUserActivity($address: String!) {
        user(id: $address) {
          buyTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
            id
            block
            timestamp
            askPrice
            netPrice
            withBNB
            buyer {
              id
            }
            seller {
              id
            }
            nft {
              tokenId
              metadataUrl
              currentAskPrice
              currentSeller
              latestTradedPriceInBNB
              tradeVolumeBNB
              totalTrades
              isTradable
              updatedAt
              otherId
              collection {
                id
              }
            }
          }
          sellTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
            id
            block
            timestamp
            askPrice
            netPrice
            withBNB
            buyer {
              id
            }
            seller {
              id
            }
            nft {
              tokenId
              metadataUrl
              currentAskPrice
              currentSeller
              latestTradedPriceInBNB
              tradeVolumeBNB
              totalTrades
              isTradable
              updatedAt
              otherId
              collection {
                id
              }
            }
          }
          askOrderHistory(first: 500, orderBy: timestamp, orderDirection: desc) {
            id
            block
            timestamp
            orderType
            askPrice
            nft {
              tokenId
              metadataUrl
              currentAskPrice
              currentSeller
              latestTradedPriceInBNB
              tradeVolumeBNB
              totalTrades
              isTradable
              updatedAt
              otherId
              collection {
                id
              }
            }
          }
        }
      }`,
      variables: {
        address: account,
      },
    }),
  }).then((res) => res.json())

  return json
}

export const getNFTCollections = async () => {
  const json = fetch('https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        collections {
          id
          name
          symbol
          active
          totalTrades
          totalVolumeBNB
          numberTokensListed
          creatorAddress
          tradingFee
          creatorFee
          whitelistChecker
        }
      }`,
    }),
  }).then((res) => res.json())

  return json
}

export const getNFTImage = (contractAddress, tokenId) => {
  const json = axios(`https://nft.pancakeswap.com/api/v1/collections/${contractAddress}/tokens/${tokenId}`).then((res) => res.data.data.image.original)
  return json
}
