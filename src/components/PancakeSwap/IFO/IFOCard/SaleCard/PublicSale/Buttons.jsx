import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import ChangeNetwork from 'components/ConnectWallet/Ethereum/WrongNetwork'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import useBlockNumber from 'hooks/useBlocknumber'
import { useEffect, useState } from 'react'
import { getCakeContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import { getVaultUserData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
import DepositCAKE from '../Buttons/DepositCAKE'
import HarvestTokens from '../Buttons/HarvestTokens'

const Buttons = () => {
  const [currentBlockNumber] = useBlockNumber()
  const { account, active, chainId } = useWeb3React()
  const [isApproved, setIsApproved] = useState()
  const [userData, setUserData] = useState([])
  const cakeContract = getCakeContract(chainId)

  async function checkApprove() {
    const userCakeData = await getVaultUserData(account)
    setUserData(userCakeData)
    const getApprove = await cakeContract.methods.allowance(account, ifo[0].poolContract).call()
    if (getApprove > 0) {
      setIsApproved(true)
    } else {
      setIsApproved(false)
    }
  }

  useEffect(() => {
    if (active === true && chainId === 56) {
      const checkerPublic = setInterval(() => {
        checkApprove()
      }, 3000)

      if (isApproved) {
        clearInterval(checkerPublic)
      }
    }
    // eslint-disable-next-line
  }, [chainId, active])

  return (
    <div>
      {active ? (
        <div>
          {chainId === 56 ? (
            <div>
              {userData.isLocked ? (
                <div>
                  {isApproved ? (
                    <div>
                      {currentBlockNumber >= ifo[0].startBlock && currentBlockNumber <= ifo[0].endBlock ? <DepositCAKE poolType='public' /> : <Alert variant='error' text='თქვენ არ გაქვთ iCAKE-ი Public SALE-ში გამოსაყენებლად.' />}
                      {currentBlockNumber > ifo[0].endBlock ? <HarvestTokens poolType={1} /> : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <Alert variant='error' text='თქვენ არ გაქვთ iCAKE-ი Public SALE-ში გამოსაყენებლად.' />
                </div>
              )}
            </div>
          ) : (
            <ChangeNetwork changeTo='BSC' text='გადართე BSC ქსელზე' />
          )}
        </div>
      ) : (
        <ConnectButton text='დააკავშირე საფულე' />
      )}
    </div>
  )
}

export default Buttons
