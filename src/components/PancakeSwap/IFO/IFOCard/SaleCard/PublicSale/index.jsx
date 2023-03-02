import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import Card from 'components/Cards/Card'
import ConnectButton from 'components/ConnectWallet/Ethereum/ConnectButton'
import IFOIcons from 'components/PancakeSwap/IFO/components/IFOIcons'
import Skelaton from 'components/Skelaton'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import useBlockNumber from 'hooks/useBlocknumber'
import { useCakePrice } from 'hooks/useDexTokenPrices'
import { useEffect, useState } from 'react'
import { getCakeContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import { getVaultUserData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
import { getIfoTokenPrice, getUserIfoData } from 'utils/BNBChain/PancakeSwapHelpers/IfoHelpers'
import ApproveIFO from '../Buttons/ApproveIFO'
import Buttons from './Buttons'
import Requirments from './Requirments'

const Index = () => {
  const { account, active, chainId } = useWeb3React()
  const [isApproved, setIsApproved] = useState()
  const [userData, setUserData] = useState([])
  const [ifoState, setIfoState] = useState('')
  const [userICAKE, setUserICAKE] = useState()
  const [userICAKEUSD, setUserICAKEUSD] = useState()
  const [vaultData, setVaultData] = useState([])
  const [unlockedToken, setUnlockedToken] = useState(0)
  const [userDepositedCakePublic, setUserDepositedCakePublic] = useState(0)
  const [userSpentCake, setUserSpentCake] = useState(0)
  const [userCakeToReturn, setUserCakeToReturn] = useState(0)
  const [userRecivedTokenPublic, setUserRecivedTokenPublic] = useState(0)
  const [cakePrice, setCakePrice] = useState(0)
  const [tokenPrice, setTokenPrice] = useState(0)
  const [currentBlockNumber] = useBlockNumber()
  const cakeContract = getCakeContract(chainId)

  const ICAKEChecker = async () => {
    const price = await useCakePrice()
    setCakePrice(price)
    const getTokenPrice = await getIfoTokenPrice(ifo[0].tokenDetails.address, ifo[0].tokenDetails.decimal)
    setTokenPrice(getTokenPrice)
    const getUser = await getVaultUserData(account)
    setVaultData(getUser)
    setUserICAKE(getUser.depositedCake)
    setUserICAKEUSD(Number(getUser.depositedCake) * Number(price))
  }

  const detailsPublic = async () => {
    const data = await getUserIfoData(ifo[0].poolContract, account, ifo[0].isVested, ifo[0].tokenDetails.symbol, ifo[0].tokenDetails.decimal, ifo[0].tokenDetails.name, ifo[0].tokenDetails.symbol, ifo[0].tokenDetails.tokenLogo, ifo[0].unlockPercent)
    setUserData(data)
    setUserDepositedCakePublic(data.publicSale.deposited)
    setUserSpentCake(data.publicSale.spent)
    setUserRecivedTokenPublic(data.publicSale.receivedToken)
    setUserCakeToReturn(data.publicSale.unspent)
    setUnlockedToken(data.publicSale.unlocked)
  }

  const checkApprove = async () => {
    const getApprove = await cakeContract.methods.allowance(account, ifo[0].poolContract).call()
    if (Number(getApprove) > 0) {
      setIsApproved(true)
    } else {
      setIsApproved(false)
    }
  }

  useEffect(() => {
    if (Number(currentBlockNumber) < ifo[0].startBlock) {
      setIfoState('SOON')
    }

    if (Number(currentBlockNumber) > ifo[0].startBlock && Number(currentBlockNumber) < ifo[0].endBlock) {
      setIfoState('LIVE')
    }

    if (Number(currentBlockNumber) > ifo[0].endBlock) {
      setIfoState('FINISHED')
    }

    if (active === true && chainId === 56 && ifo[0].poolContract !== null) {
      ICAKEChecker()
      detailsPublic()
      checkApprove()
    }
    // eslint-disable-next-line
  }, [active, chainId, currentBlockNumber])

  return (
    <div>
      <Card>
        <div className='p-2 text-white bg-primary rounded-t-lg'>
          <p className=''>Public Sale {ifo[0].isCIFO ? '(cIFO)' : null}</p>
        </div>
        <div className='p-3 flex flex-col space-y-4'>
          <IFOIcons name='შეტანილი' token={userDepositedCakePublic} tokenPrice={cakePrice} tokenAddress='0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' />
          <IFOIcons name='გახარჯული' token={userSpentCake} tokenPrice={cakePrice} tokenAddress='0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' />
          <IFOIcons name='დაგიბრუნდებათ' token={userCakeToReturn} tokenPrice={cakePrice} tokenAddress='0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' />
          <IFOIcons name={`ნაყიდი ${ifo[0].tokenDetails.symbol}`} token={userRecivedTokenPublic} tokenPrice={tokenPrice} tokenAddress={ifo[0].tokenDetails.address} />
          <div className='flex justify-center'>
            <p className='text-lightText   text-xs'>
              დამთავრებისას აიღებთ {Number(unlockedToken).toLocaleString('en-US')} (${Number(Number(unlockedToken) * Number(tokenPrice)).toLocaleString('en-US')})
            </p>
          </div>
        </div>
        {active ? <div>{chainId === 56 ? <div>{ifoState === 'SOON' ? <Requirments /> : null}</div> : null}</div> : null}
        <div className='px-3'>
          {active ? (
            <div>
              {chainId === 56 ? (
                <div>
                  {ifo[0].poolContract !== null ? (
                    <div>
                      {ifoState === 'SOON' ? (
                        <div>{Object.keys(vaultData).length > 0 ? <div>{vaultData.isLocked ? <Alert variant='success' text='შეგეძლებათ მონაწილეობის მიღება.' /> : <Alert variant='error' text='ვერ მიიღებთ მონაწილეობას.' />}</div> : null}</div>
                      ) : null}

                      {ifoState === 'LIVE' ? (
                        <div>
                          <Buttons />
                        </div>
                      ) : null}

                      {ifoState === 'FINISHED' ? (
                        <div>
                          {Object.keys(userData).length > 0 ? (
                            <div>
                              {userData.publicSale.participated ? <div>{userData.publicSale.claimed ? <Alert variant='success' text='ტოკენები აღებული გაქვთ.' /> : <Buttons />}</div> : <Alert variant='warning' text='არ მიგიღიათ მონაწილეობა.' />}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <Alert variant='info' text='კონტრაქტი გაშვებული არაა.' />
                    </div>
                  )}
                  {isApproved ? null : (
                    <div className='mt-3'>
                      <ApproveIFO />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <ConnectButton text='დააკავშირეთ საფულე' />
          )}
        </div>
        <div className='p-3'>
          {active ? (
            <div className='flex justify-between text-lightText'>
              <p className='text-sm'>შესასვლელად:</p>
              {Number(userICAKE) >= 0 ? (
                <p className='font-bold text-sm'>
                  {Number(userICAKE).toFixed(2)} (${Number(userICAKEUSD).toFixed(0)})
                </p>
              ) : (
                <Skelaton />
              )}
            </div>
          ) : null}
          <div className='flex justify-between text-lightText'>
            <p className='text-sm'>ასაგროვებელი:</p>
            <p className='font-bold text-sm'>${Number(ifo[0].publicPool.raiseAmount).toLocaleString('en-US')}</p>
          </div>
          <div className='flex justify-between text-lightText'>
            <p className='text-sm'>გამოყოფილი:</p>
            <p className='font-bold text-sm'>{ifo[0].publicPool.saleAmount.toLocaleString('en-US')} </p>
          </div>
          <div className='flex justify-between text-lightText'>
            <p className='text-sm'>{ifo[0].tokenDetails.symbol}-ს ფასი:</p>
            <p className='font-bold text-sm'>${Number(ifo[0].tokenOfferingPrice).toFixed(3)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Index
