import { getLotteryContract } from './contractHelpers'

export const getUserLotteryTickets = async (account) => {
  const json = fetch('https://api.thegraph.com/subgraphs/name/pancakeswap/lottery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query getUserLotteries($account: ID!, $first: Int!, $skip: Int!, $where: Round_filter) {
        user(id: $account) {
          id
          totalTickets
          totalCake
          rounds(
            first: $first
            skip: $skip
            where: $where
            orderDirection: desc
            orderBy: block
          ) {
            id
            lottery {
              id
              endTime
              status
            }
            claimed
            totalTickets
          }
        }
      }`,
      variables: {
        account: account,
        first: 100,
        skip: 0,
        where: {},
      },
    }),
  }).then((res) => res.json())

  return json
}

export const getUserLotteryTicketWithData = async (account, lotteryId) => {
  const lotteryContract = getLotteryContract()
  const getTicketNumbers = await lotteryContract.methods.viewUserInfoForLotteryId(account, lotteryId, 0, 100).call()
  return getTicketNumbers
}

export const getUserLotteryRoundsWithData = async (account) => {
  const biletebi = []
  const lataria = await getUserLotteryTickets(account)
  if (lataria.data.user === null) {
    return 'ლატარია ნათამაშები არ არის!'
  } else {
    lataria.data.user.rounds.forEach(async (x) => {
      const lotteryData = await getUserLotteryTicketWithData(account, x.lottery.id)
      const winningNumbers = []
      if (lotteryData[1].length > 0) {
        lotteryData[1].forEach((y) => {
          const correctNumber = y.substring(1)
          const formatedNumber = correctNumber.split('').reverse().join('')
          winningNumbers.push(formatedNumber)
        })
      }
      biletebi.push({ lotteryId: x.lottery.id, numbers: winningNumbers, isWinner: lotteryData[2] })
    })

    return biletebi
  }
}

export const getLotteries = async (first, skip) => {
  const json = fetch('https://api.thegraph.com/subgraphs/name/pancakeswap/lottery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query getLotteries($first: Int!, $skip: Int!, $where: Lottery_filter) {
        lotteries(
          first: $first
          skip: $skip
          where: $where
          orderDirection: desc
          orderBy: block
        ) {
          id
          totalUsers
          totalTickets
          winningTickets
          status
          finalNumber
          startTime
          endTime
          ticketPrice
        }
      }`,
      variables: {
        first: first,
        skip: skip,
        where: {},
      },
    }),
  }).then((res) => res.json())

  return json
}

export const getFrequetNumber = (arr) => {
  return arr.sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length).pop()
}

export const formatFinalNumber = (number) => {
  const reverse = String(number).split('').reverse().join('')
  const data = String(reverse).slice(0, -1)
  return data
}

export const mostRepeatedNumbers = (lotteryData) => {
  const firstNumber = []
  const secondNumber = []
  const thirdNumber = []
  const fourthNumber = []
  const fifthNumber = []
  const sixthNumber = []

  if (lotteryData.length > 0) {
    lotteryData.forEach((x) => {
      if (x.finalNumber !== null) {
        const number = formatFinalNumber(x.finalNumber)
        firstNumber.push(number[0])
        secondNumber.push(number[1])
        thirdNumber.push(number[2])
        fourthNumber.push(number[3])
        fifthNumber.push(number[4])
        sixthNumber.push(number[5])
      }
    })
    const one = getFrequetNumber(firstNumber)
    const two = getFrequetNumber(secondNumber)
    const three = getFrequetNumber(thirdNumber)
    const four = getFrequetNumber(fourthNumber)
    const five = getFrequetNumber(fifthNumber)
    const sixth = getFrequetNumber(sixthNumber)
    const frequentString = `${one}${two}${three}${four}${five}${sixth}`
    return frequentString
  }
}
