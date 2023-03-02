import { useWeb3React } from '@web3-react/core'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import WrongNetwork from 'components/ConnectWallet/Ethereum/WrongNetwork'
import { useEffect, useState } from 'react'
import { getUserSyrupPoolData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
import ApproveButton from './ApproveButton'
import DepositButton from './DepositButton'
import WithdrawButton from './WithdrawButton'

const Buttons = ({ name, poolContract, stakedCake }) => {
  const { account, active, chainId } = useWeb3React()
  const [approved, setApproved] = useState()

  const getData = async () => {
    const userData = await getUserSyrupPoolData(poolContract, account)
    setApproved(userData.isApproved)
  }

  useEffect(() => {
    if (active === true) {
      getData()
    }
    // eslint-disable-next-line
  }, [active])

  return (
    <div>
      {active ? (
        <div>
          {chainId === 56 ? (
            <div>
              {approved ? (
                <div className='space-y-2'>
                  <div>{Number(stakedCake) > 0 ? <WithdrawButton poolContract={poolContract} name={name} /> : null}</div>
                  <div>
                    <DepositButton name={name} poolContract={poolContract} />
                  </div>
                </div>
              ) : (
                <ApproveButton poolContract={poolContract} name={name} />
              )}
            </div>
          ) : (
            <WrongNetwork text='გადართე BSC ქსელზე' changeTo='BSC' />
          )}
        </div>
      ) : (
        <ConnectButton text='დააკავშირეთ საფულე' />
      )}
    </div>
  )
}

export default Buttons
