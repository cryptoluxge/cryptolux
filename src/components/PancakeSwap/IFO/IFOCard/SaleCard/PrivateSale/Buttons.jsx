import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import ChangeNetwork from 'components/ConnectWallet/Ethereum/WrongNetwork'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import useBlockNumber from 'hooks/useBlocknumber'
import { useEffect, useState } from 'react'
import { getCakeContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import DepositCAKE from '../Buttons/DepositCAKE'
import HarvestTokens from '../Buttons/HarvestTokens'
import EligibleChecker from './eligibleChecker'

const Buttons = () => {
  const [currentBlockNumber] = useBlockNumber()
  const [isApproved, setIsApproved] = useState()
  const { account, active, chainId } = useWeb3React()
  const isEligible = EligibleChecker()
  const cakeContract = getCakeContract(chainId)

  async function checkApprove() {
    const getApprove = await cakeContract.methods.allowance(account, ifo[0].poolContract).call()
    if (getApprove > 0) {
      setIsApproved(true)
    } else {
      setIsApproved(false)
    }
  }

  useEffect(() => {
    if (active === true && chainId === 56) {
      const checkerPrivate = setInterval(() => {
        checkApprove()
      }, 3000)

      if (isApproved === true) {
        clearInterval(checkerPrivate)
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
              <div>
                {isEligible ? (
                  <div>
                    {isApproved ? (
                      <div>
                        {currentBlockNumber >= ifo[0].startBlock && currentBlockNumber <= ifo[0].endBlock ? <DepositCAKE poolType='private' /> : null}
                        {currentBlockNumber > ifo[0].endBlock ? <HarvestTokens poolType={0} /> : null}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    {ifo[0].isCIFO ? (
                      <div>
                        <Alert variant='error' text={`საჭიროა ${ifo[0].requiredPoints} ქულა მონაწილეობის მისაღებად.`} />
                      </div>
                    ) : (
                      <div>
                        <Alert variant='error' text='პროფილის ფოტოდ არ გიყენიათ Squad NFT.' />
                      </div>
                    )}
                  </div>
                )}
              </div>
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
