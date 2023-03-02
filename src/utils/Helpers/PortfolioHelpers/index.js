export const calculateProfitLossAndPercent = (totalProfit, totalInvested) => {
  if (totalProfit !== 0 && totalInvested !== 0) {
    const profit = totalProfit - totalInvested
    const percentageProfit = (profit / totalInvested) * 100

    return {
      profitUSD: profit.toLocaleString('en-US'),
      percentageProfit: percentageProfit,
    }
  } else {
    return {
      profitUSD: 0,
      percentageProfit: 0,
    }
  }
}

export const calculateCoinProfitPercentAndUSD = (purchasePrice, currentPrice, quantity) => {
  const profitPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100
  const profitUSD = (currentPrice - purchasePrice) * quantity

  return {
    profitPercent,
    profitUSD,
  }
}

export const calculateInvested = () => {
  const getUserPortfolio = JSON.parse(localStorage.getItem('userPortfolio'))
  if (getUserPortfolio !== null) {
    const totalInvested = getUserPortfolio.reduce((acc, curr) => acc + curr.invested, 0)
    return totalInvested
  } else {
    return 0
  }
}

export const calculatePriceForX = (from, value) => {
  const totalInvested = calculateInvested()
  let profit = []
  const userPortfolio = JSON.parse(localStorage.getItem('userPortfolio'))
  if (userPortfolio !== null && Object.keys(userPortfolio).length !== 0) {
    userPortfolio.forEach((x) => {
      if (from === 'ath') {
        const getATH = x.marketData.ath.usd
        const getATHX = Number(getATH) * Number(value)
        profit.push(Number(x.quantity) * getATHX)
      } else if (from === 'buyPrice') {
        const getBuyPrice = x.price
        const getBuyPriceX = Number(getBuyPrice) * Number(value)
        profit.push(Number(x.quantity) * getBuyPriceX)
      }
    })
  }
  const sumProfit = profit.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  })

  const percentageProfit = (sumProfit / totalInvested) * 100

  return { sumProfit: sumProfit, percentageProfit: percentageProfit }
}
