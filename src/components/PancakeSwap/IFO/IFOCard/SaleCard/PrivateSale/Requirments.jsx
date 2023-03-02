import { useWeb3React } from '@web3-react/core'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useEffect, useState } from 'react'
import { getUserHasSquadProfile, getUserPoints } from 'utils/BNBChain/PancakeSwapHelpers/profileHelpers'

const Requirments = () => {
  const { account, chainId, active } = useWeb3React()
  const [squadNft, setSquadNft] = useState()
  const [points, setPoints] = useState()

  const checkRequirments = async () => {
    if (ifo[0].isCIFO === true) {
      const hasSquadProfile = await getUserHasSquadProfile(account)
      setSquadNft(hasSquadProfile)

      const getPoints = await getUserPoints(account)
      if (Number(getPoints.points) >= ifo[0].requiredPoints) {
        setPoints(true)
      }
    } else {
      const hasSquadProfile = await getUserHasSquadProfile(account)
      setSquadNft(hasSquadProfile)
    }
  }

  useEffect(() => {
    if (active) {
      checkRequirments()
    }
    // eslint-disable-next-line
  }, [active, chainId])

  return (
    <div className='flex flex-col items-center px-3 mb-3 gap-3'>
      <div className={`border-[1px] ${squadNft ? 'border-green-500 bg-green-900' : 'border-red-500 bg-red-900'} rounded-lg p-2 w-full`}>
        <div className={`flex items-center gap-1`}>
          <svg viewBox='0 0 24 24' width='25px' xmlns='http://www.w3.org/2000/svg'>
            <path
              fill={squadNft ? '#38a169' : '#961414'}
              fullrule='evenodd'
              clipRule='evenodd'
              d='M12 14.2619C9.69993 14.2619 7.57238 14.6197 5.98327 15.2327C5.19201 15.5379 4.48317 15.9258 3.95486 16.4076C3.42611 16.8898 3 17.544 3 18.3476C3 20.0992 4.33478 21.5622 6.07901 21.7223L6.21662 21.735C10.0641 22.0883 13.9359 22.0883 17.7834 21.735L17.921 21.7223C19.6652 21.5622 21 20.0992 21 18.3476C21 17.544 20.5739 16.8898 20.0451 16.4076C19.5168 15.9258 18.808 15.5379 18.0167 15.2327C16.4276 14.6197 14.3001 14.2619 12 14.2619ZM5 18.3476C5 18.2991 5.0216 18.1416 5.3025 17.8854C5.58383 17.6289 6.04656 17.3519 6.70302 17.0987C8.00934 16.5948 9.88179 16.2619 12 16.2619C14.1182 16.2619 15.9907 16.5948 17.297 17.0987C17.9534 17.3519 18.4162 17.6289 18.6975 17.8854C18.9784 18.1416 19 18.2991 19 18.3476C19 19.0655 18.453 19.6651 17.7381 19.7307L17.6005 19.7434C13.8747 20.0855 10.1253 20.0855 6.39952 19.7434L6.26191 19.7307C5.54705 19.6651 5 19.0655 5 18.3476Z'
            />
            <path
              fill={squadNft ? '#38a169' : '#961414'}
              fullrule='evenodd'
              clipRule='evenodd'
              d='M17.5 7.7619C17.5 10.7995 15.0376 13.2619 12 13.2619C8.96243 13.2619 6.5 10.7995 6.5 7.7619C6.5 4.72433 8.96243 2.2619 12 2.2619C15.0376 2.2619 17.5 4.72433 17.5 7.7619ZM15.5 7.7619C15.5 9.6949 13.933 11.2619 12 11.2619C10.067 11.2619 8.5 9.6949 8.5 7.7619C8.5 5.82891 10.067 4.2619 12 4.2619C13.933 4.2619 15.5 5.82891 15.5 7.7619Z'
            />
          </svg>
          <p className={` text-base ${squadNft ? 'text-green-700' : 'text-white'}`}>Squad NFT</p>
        </div>
      </div>
      {ifo[0].isCIFO ? (
        <div className={`border-[1px] ${points ? 'border-green-500 bg-green-900' : 'border-red-500 bg-red-900'} rounded-lg p-2 w-full`}>
          <div className='flex items-center gap-1'>
            <svg width='25px' viewBox='0 0 27 26' xmlns='http://www.w3.org/2000/svg'>
              <path
                fill={points ? '#38a169' : '#961414'}
                fullrule='evenodd'
                clipRule='evenodd'
                d='M10.7391 2.45008C9.77247 2.68208 9.17691 3.65378 9.40891 4.62045C9.5031 5.01293 9.95601 6.07579 10.4608 7.19996H5.99961C4.67961 7.19996 3.59961 8.27996 3.59961 9.59996V10.8C3.59961 11.1825 3.63561 11.5561 3.7044 11.918C4.18592 14.4508 6.27411 16.4025 8.86761 16.728C8.96211 16.953 9.07011 17.171 9.19058 17.3811C10.0339 18.852 11.4881 19.9335 13.1996 20.28L13.1996 22.8H9.59961C8.93687 22.8 8.39961 23.3372 8.39961 24C8.39961 24.6627 8.93687 25.2 9.59961 25.2H19.1996C19.2022 25.2 19.2048 25.2 19.2074 25.1999C19.8665 25.1958 20.3996 24.6601 20.3996 24C20.3996 23.3372 19.8624 22.8 19.1996 22.8H15.5996V20.28C15.7219 20.2552 15.8428 20.2267 15.9623 20.1946C17.7547 19.7127 19.2229 18.4155 19.9316 16.728C20.3021 16.6815 20.6623 16.6018 21.009 16.4919C23.4356 15.7231 25.1996 13.4775 25.1996 10.8V9.59996C25.1996 8.27996 24.1196 7.19996 22.7996 7.19996H18.3384C18.8432 6.07579 19.2961 5.01293 19.3903 4.62045C19.6223 3.65378 19.0268 2.68208 18.0601 2.45008C17.0934 2.21808 16.1217 2.81364 15.8897 3.7803L15.069 7.19996H13.7302L12.9095 3.7803C12.6775 2.81364 11.7058 2.21808 10.7391 2.45008ZM22.7996 10.8C22.7996 12.36 21.7916 13.68 20.3996 14.184V9.59996H22.7996V10.8ZM8.39961 14.184C7.00761 13.68 5.99961 12.36 5.99961 10.8V9.59996H8.39961V14.184Z'
              />
              <path d='M28.378 23.2185L33.162 18.4253C33.162 18.4252 33.1621 18.4252 33.1621 18.4251C33.1815 18.4058 33.2084 18.3938 33.2414 18.3938C33.2744 18.3938 33.3014 18.4059 33.3208 18.4253L33.3858 18.4903C33.4277 18.5322 33.4277 18.598 33.3858 18.6399L33.3849 18.6408L27.8957 24.1486C27.8299 24.2071 27.7521 24.1981 27.7039 24.1536L25.4999 21.9311L25.4999 21.9311L25.4974 21.9286C25.4555 21.8867 25.4555 21.821 25.4974 21.7791L25.5625 21.714L24.9823 21.1338L25.5625 21.714C25.5819 21.6946 25.6089 21.6826 25.6419 21.6826C25.6747 21.6826 25.7015 21.6944 25.7209 21.7136C25.721 21.7137 25.7212 21.7139 25.7213 21.714L27.2153 23.2173L27.796 23.8016L28.378 23.2185Z' />
            </svg>
            <p className={` text-base ${points ? 'text-green-700' : 'text-white'}`}>ქულები ({ifo[0].requiredPoints})</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Requirments
