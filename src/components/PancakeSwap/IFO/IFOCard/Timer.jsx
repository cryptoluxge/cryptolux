import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import getBlockNumber from 'hooks/useBlocknumber'

const Timer = () => {
  const [currentBlockNumber] = getBlockNumber()
  return (
    <div className='bg-primary text-white  flex justify-center py-2'>
      {currentBlockNumber < ifo[0].startBlock ? `დაწყებამდე დარჩა ${ifo[0].startBlock - currentBlockNumber} ბლოკი` : null}
      {currentBlockNumber >= ifo[0].startBlock && currentBlockNumber <= ifo[0].endBlock ? `დამთავრებამდე დარჩა ${ifo[0].endBlock - currentBlockNumber} ბლოკი` : null}
      {currentBlockNumber >= ifo[0].endBlock ? `დამთავრდა` : null}
    </div>
  )
}

export default Timer
