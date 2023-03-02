import QuestionMark from 'assets/images/questionMark.svg'
import { useEffect, useState } from 'react'
import { getNFTImage } from 'utils/Helpers/AptosHelpers/NFTHelpers'

const NFTImage = ({ nftData, type }) => {
  const [nftImage, setNftImage] = useState(QuestionMark)
  const getImage = async () => {
    const fetchData = await getNFTImage(nftData.current_token_data.metadata_uri)
    setNftImage(fetchData)
  }

  const addDefaultSrc = (ev) => {
    ev.target.src = QuestionMark
  }

  useEffect(() => {
    getImage()
    // eslint-disable-next-line
  }, [nftData])

  return (
    <div>
      {type === 'table' && <img onError={addDefaultSrc} src={nftImage} alt={nftData.current_token_data.name} className='rounded-lg w-[46px] h-[46px] ' />}
      {type === 'card' && <img onError={addDefaultSrc} src={nftImage} alt={nftData.current_token_data.name} className='rounded-lg object-cover' />}
      {type === 'details' && <img onError={addDefaultSrc} src={nftImage} alt={nftData.current_token_data.name} className='rounded-lg w-full h-full' />}
      {type === 'sending' && <img onError={addDefaultSrc} src={nftImage} alt={nftData.current_token_data.name} className='rounded-lg w-full sm:w-[250px]' />}
    </div>
  )
}

export default NFTImage
