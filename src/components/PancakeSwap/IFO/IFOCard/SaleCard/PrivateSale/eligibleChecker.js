import { useWeb3React } from '@web3-react/core'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useEffect, useRef, useState } from 'react'
import { getUserHasSquadProfile, getUserPoints } from 'utils/BNBChain/PancakeSwapHelpers/profileHelpers'

const Index = () => {
  const mountedRef = useRef(true)
  const { account, active, chainId } = useWeb3React()
  const [isEligible, setIsEligible] = useState(Boolean)

  const check = async () => {
    const isSquad = await getUserHasSquadProfile(account)
    if (ifo[0].isCIFO === true) {
      const userPoints = await getUserPoints(account)
      if (Number(userPoints.points) > ifo[0].requiredPoints || isSquad === true) {
        setIsEligible(true)
      } else {
        setIsEligible(false)
      }
    } else {
      setIsEligible(isSquad)
    }
  }

  useEffect(() => {
    if (active === true && account.length > 0 && chainId === 56) {
      check()
    }
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [account, active])

  return isEligible
}

export default Index
