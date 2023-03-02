import Card from 'components/Cards/Card'
import { useState } from 'react'
import { getNftDetails } from 'utils/Helpers/AptosHelpers/NFTHelpers'
import NFTImage from '../NFTImage'
import NFTModal from '../NFTModal'
import SendButton from '../SendButton'

const NFTCard = ({ data, isChecking }) => {
  const [open, setOpen] = useState(false)
  const [nftAttributes, setNftAttributes] = useState([])

  const openModal = async () => {
    setOpen(!open)
    const getTest = await getNftDetails(data.current_token_data.metadata_uri)
    setNftAttributes(getTest)
  }
  return (
    <div>
      <div className='flex'>
        <Card>
          <div className='p-2 duration-200 hover:bg-lightBorder rounded-lg'>
            <div onClick={() => openModal()} className='w-full cursor-pointer'>
              <NFTImage nftData={data} type='card' />
            </div>
            <div className='mt-2'>
              <p className='text-gray-400 text-sm'>{data.current_token_data.collection_name}</p>
              <p className='text-gray-100 text-md'>{data.current_token_data.name}</p>
            </div>
            {isChecking === false && <div className='mt-2'><SendButton data={data} /></div>}
          </div>
        </Card>
      </div>
      <NFTModal data={data} nftAttributes={nftAttributes} isChecking={isChecking} modalOpen={open} modalClose={() => setOpen(!open)} />
    </div>
  )
}

export default NFTCard
