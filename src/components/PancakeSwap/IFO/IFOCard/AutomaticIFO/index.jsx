import { useWeb3React } from '@web3-react/core'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { PancakeSwapTokens } from 'config/BNBChain/PancakeSwap/constants/tokens'
import { useToast } from 'hooks/useToast'
import { useEffect, useRef } from 'react'
import { getBep20TokenContract, getCakeContract, getIfoPoolContract, getSwapContract } from 'utils/BNBChain/PancakeSwapHelpers/contractHelpers'
import Web3 from 'web3'

const Index = () => {
  const mountedRef = useRef(true)
  const { active, account, chainId } = useWeb3React()
  const web3 = new Web3(window.ethereum)
  const toast = useToast()
  const offeringTokenIFOPoolContract = getIfoPoolContract(ifo[0].poolContract, chainId)
  const lpContract = getCakeContract()

  const autoWithdraw = async (poolType) => {
    await offeringTokenIFOPoolContract.methods
      .harvestPool(poolType)
      .send({ from: account, gasLimit: ifo[0].gasLimits.harvest })
      .once('transactionHash', (hash) => {
        toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
      })
      .on('error', (error) => {
        if (error.code === 4001) {
          toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
        } else if (error.code === -32003) {
          toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
        } else if (error.code === -32603) {
          toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
        } else {
          toast('error', 'არ დადასტურდა')
        }
      })
      .then((receipt) => {
        if (receipt.status === true) {
          toast('success', `თქვენი ტრანზაქცია დადასტურდა`, `თქვენ გამოიტანეთ ${ifo[0].tokenDetails.symbol} IFO-დან`, receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
        }
      })
  }

  const autoDeposit = async (poolType) => {
    const userCakeBalance = await lpContract.methods.balanceOf(account).call()
    await offeringTokenIFOPoolContract.methods
      .depositPool(userCakeBalance, poolType)
      .send({ from: account, gasLimit: ifo[0].gasLimits.deposit })
      .once('transactionHash', (hash) => {
        toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
      })
      .on('error', (error) => {
        if (error.code === 4001) {
          toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
        } else if (error.code === -32003) {
          toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
        } else if (error.code === -32603) {
          toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
        } else {
          toast('error', 'არ დადასტურდა')
        }
      })
      .then((receipt) => {
        if (receipt.status === true) {
          toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', `თქვენ შეიტანეთ CAKE-ი IFO-ში`, receipt.transactionHash)
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
        }
      })
  }

  const cakeSell = async () => {
    const offeringTokenContract = getBep20TokenContract(PancakeSwapTokens.cake.contractAddress, chainId)
    const swapContract = getSwapContract(chainId)
    const cakeBalance = await offeringTokenContract.methods.balanceOf(account).call()
    if (cakeBalance > 0) {
      const amountIn = cakeBalance
      const path = [PancakeSwapTokens.cake.contractAddress, PancakeSwapTokens.busd.contractAddress]
      const toAddress = account
      const deadline = Date.now() + 100000
      const amountOut = await swapContract.methods.getAmountsOut(cakeBalance, [PancakeSwapTokens.cake.contractAddress, PancakeSwapTokens.busd.contractAddress]).call()
      const amountOutMin = amountOut[1]

      await swapContract.methods
        .swapExactTokensForTokens(amountIn, amountOutMin, path, toAddress, deadline)
        .send({ from: account, gasLimit: ifo[0].gasLimits.swap })
        .once('transactionHash', (hash) => {
          toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
        })
        .on('error', (error) => {
          if (error.code === 4001) {
            toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
          } else if (error.code === -32003) {
            toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
          } else if (error.code === -32603) {
            toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
          } else {
            toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!')
          }
        })
        .then((receipt) => {
          if (receipt.status === true) {
            toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', 'ქეიქი გაიყიდა!', receipt.transactionHash)
          } else {
            toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
          }
        })
    }
  }

  async function autoSell() {
    const botTimer = setInterval(async () => {
      const offeringTokenContract = getBep20TokenContract(ifo[0].tokenDetails.address, chainId)
      const swapContract = getSwapContract(chainId)
      const tokenBalance = await offeringTokenContract.methods.balanceOf(account).call()
      const sellCake = document.getElementById('sellAllCake').checked
      if (tokenBalance > 0) {
        clearInterval(botTimer)
        const amountIn = tokenBalance
        const path = [ifo[0].tokenDetails.address, ifo[0].quoteTokenAddress]
        const toAddress = account
        const deadline = Date.now() + 100000
        /* const amountOut = await swapContract.methods.getAmountsOut(tokenBalance, [ifo[0].tokenDetails.address, ifo[0].quoteTokenAddress]).call() */
        const amountOutMin = 0

        await swapContract.methods
          .swapExactTokensForTokens(amountIn, amountOutMin, path, toAddress, deadline)
          .send({ from: account, gasLimit: ifo[0].gasLimits.swap })
          .once('transactionHash', (hash) => {
            toast('loading', 'თქვენი ტრანზაქცია მუშავდება', '', hash)
          })
          .on('error', (error) => {
            if (error.code === 4001) {
              toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
            } else if (error.code === -32003) {
              toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
            } else if (error.code === -32603) {
              toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
            } else {
              toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!')
            }
          })
          .then((receipt) => {
            if (receipt.status === true) {
              if (sellCake === true) {
                cakeSell()
              }
              toast('success', 'თქვენი ტრანზაქცია დადასტურდა!', 'თქვენი ტოკენები გაიყიდა!', receipt.transactionHash)
            } else {
              toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
            }
          })
      }
    }, 1000)
  }

  async function AutoFunction() {
    const botTimer = setInterval(async () => {
      const bn = await web3.eth.getBlockNumber()
      const autoDepositInPublic = document.getElementById('autoDepositInPublic').checked
      const autoWithdrawInPublic = document.getElementById('autoWithdrawInPublic').checked
      const autoWithdrawAndSellInPublic = document.getElementById('autoWithdrawAndSellInPublic').checked
      const autoDepositInPrivate = document.getElementById('autoDepositInPrivate').checked
      const autoWithdrawInPrivate = document.getElementById('autoWithdrawInPrivate').checked
      const autoWithdrawAndSellInPrivate = document.getElementById('autoWithdrawAndSellInPrivate').checked

      if (bn >= ifo[0].endBlock) {
        if (autoWithdrawInPublic === true) {
          clearInterval(botTimer)
          document.getElementById('autoWithdrawInPublic').checked = false
          await autoWithdraw(1)
        }

        if (autoWithdrawAndSellInPublic === true) {
          clearInterval(botTimer)
          document.getElementById('autoWithdrawAndSellInPublic').checked = false
          await autoWithdraw(1)
          await autoSell()
        }

        if (autoWithdrawInPrivate === true) {
          clearInterval(botTimer)
          document.getElementById('autoWithdrawInPrivate').checked = false
          await autoWithdraw(0)
        }

        if (autoWithdrawAndSellInPrivate === true) {
          clearInterval(botTimer)
          document.getElementById('autoWithdrawAndSellInPrivate').checked = false
          await autoWithdraw(0)
          await autoSell()
        }
      }

      if (bn > ifo[0].startBlock && bn < ifo[0].endBlock) {
        if (autoDepositInPublic === true) {
          //  ეგრევე შეტანა პაბლიკში
          document.getElementById('autoDepositInPublic').checked = false
          await autoDeposit(1)
        }

        if (autoDepositInPrivate === true) {
          //  ეგრევე შეტანა პრივატეში
          document.getElementById('autoDepositInPrivate').checked = false
          await autoDeposit(0)
        }
      }
    }, 3000)
  }

  useEffect(() => {
    if (active === true && chainId === 56) {
      AutoFunction()
    }
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <div>
      <div className='grid grid-row-2 md:grid-cols-2 gap-5 p-3'>
        {/* Public Sale */}
        <div>
          <div className='flex'>
            <div>
              <input id='autoDepositInPublic' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
            </div>
            <label className='ml-2 text-sm  text-lightText'>რომ დაიწყება შემატანინე (PUBLIC)</label>
          </div>
          <div className='flex'>
            <div>
              <input id='autoWithdrawInPublic' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
            </div>
            <label className='ml-2 text-sm  text-lightText'>რომ მორჩება გამომატანინე (PUBLIC)</label>
          </div>
          <div className='flex'>
            <div>
              <input id='autoWithdrawAndSellInPublic' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
            </div>
            <label className='ml-2 text-sm  text-lightText'>რომ მორჩება გამომატანინე და გამაყიდინე (PUBLIC)</label>
          </div>
        </div>
        {/* Private Sale */}
        <div>
          <div className='flex'>
            <div>
              <input id='autoDepositInPrivate' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
            </div>
            <label className='ml-2 text-sm  text-lightText'>რომ დაიწყება შემატანინე (PRIVATE)</label>
          </div>
          <div className='flex'>
            <div>
              <input id='autoWithdrawInPrivate' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
            </div>
            <label className='ml-2 text-sm  text-lightText'>რომ მორჩება გამომატანინე (PRIVATE)</label>
          </div>
          <div className='flex'>
            <div>
              <input id='autoWithdrawAndSellInPrivate' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
            </div>
            <label className='ml-2 text-sm  text-lightText'>რომ მორჩება გამომატანინე და გამაყიდინე (PRIVATE)</label>
          </div>
        </div>
      </div>
      <div className='flex px-3 mb-2'>
        <div>
          <input id='sellAllCake' type='checkbox' value='' className='w-4 h-4 rounded text-primary bg-gray-100 border-gray-300  ' />
        </div>
        <label className='ml-2 text-sm  text-lightText'>რომ გამოვიტან და გავყიდი ქეიქიც გამაყიდინე</label>
      </div>
    </div>
  )
}

export default Index
