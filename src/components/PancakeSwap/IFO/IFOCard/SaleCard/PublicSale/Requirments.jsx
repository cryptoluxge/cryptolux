import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { AiFillLock, AiFillUnlock } from 'react-icons/ai'
import { getVaultUserData } from 'utils/BNBChain/PancakeSwapHelpers/Helpers'
const Requirments = () => {
  const { account, chainId, active } = useWeb3React()
  const [userData, setUserData] = useState([])

  const checkRequirments = async () => {
    const data = await getVaultUserData(account)
    setUserData(data)
  }

  useEffect(() => {
    if (active && chainId === 56) {
      checkRequirments()
    }
    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <div className='flex items-center px-3 mb-3'>
      <div className={`border-[1px] ${userData.isLocked ? 'border-green-500 bg-green-900' : 'border-red-500 bg-red-900'} rounded-lg p-2 w-full`}>
        <div className={`flex items-center gap-1`}>
          {userData.isLocked ? <AiFillLock className={`text-2xl ${userData.isLocked ? 'text-[#38a169]' : 'text-red-500'}`} /> : <AiFillUnlock className={`text-2xl ${userData.isLocked ? 'text-[#38a169]' : 'text-red-500'}`} />}
          <p className={` text-sm ${userData.isLocked ? 'text-green-600' : 'text-white'}`}>iCAKE: {Number(userData.depositedCake).toLocaleString('en-US')}</p>
        </div>
      </div>
    </div>
  )
}

export default Requirments
