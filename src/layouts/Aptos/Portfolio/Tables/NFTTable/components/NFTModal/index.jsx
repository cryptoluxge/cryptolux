import Modal from 'components/Modal'
import Typography from 'components/Typography'
import { checkIfStakable, convertHexToString } from 'utils/Helpers/AptosHelpers/NFTHelpers'
import NFTImage from '../NFTImage'
import SendButton from '../SendButton'

const NFTModal = ({ data, nftAttributes, isChecking, modalOpen, modalClose }) => {
  return (
    <div>
      <Modal title={data.current_token_data.name} open={modalOpen} close={modalClose} width='w-full md:w-[850px]'>
        <div className='p-3'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='w-full md:w-[500px] h-auto'>
              <NFTImage nftData={data} type='details' />
            </div>
            <div className='w-full'>
              <div>
                <Typography className='text-2xl whitespace-nowrap'>{data.current_token_data.name}</Typography>
                <Typography className='text-md' color='text-gray-400'>
                  {data.current_token_data.collection_name}
                </Typography>
                {isChecking === false && (
                  <div className='flex mt-1 gap-2'>
                    <SendButton data={data} />
                    {checkIfStakable(data.current_token_data.creator_address, data)}
                  </div>
                )}

                <div className='border-[1px] border-lightBorder mt-4 mb-4 w-full'></div>
              </div>
              <div>
                <Typography className='mb-2' color='text-gray-500'>
                  აღწერა
                </Typography>
                <Typography className='mb-1'>{nftAttributes?.data?.description}</Typography>
                <div className='border-[1px] border-lightBorder mt-4 mb-4 w-full'></div>
              </div>
              <div>
                <Typography className='mb-2' color='text-gray-500'>
                  ატრიბუტები
                </Typography>
                {Object.keys(data.current_token_data.default_properties).length > 0 ? (
                  <div className='w-full'>
                    <div className='flex flex-auto flex-wrap gap-2'>
                      {Object.keys(data.current_token_data.default_properties).map((x) => (
                        <div key={x} className='bg-lightBorder drop-shadow-sm p-2 rounded-lg border-[1px] border-lightBorder'>
                          <p className='text-gray-500 uppercase text-xs'>{x}</p>
                          <p className='text-white text-sm'>{convertHexToString(data.current_token_data.default_properties[x])}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='w-full'>
                    {(nftAttributes !== null || nftAttributes !== undefined) && Object.keys(nftAttributes).length > 0 && (
                      <div className='flex flex-auto flex-wrap gap-2'>
                        {nftAttributes?.data?.attributes?.map((x) => (
                          <div key={x.trait_type} className='bg-lightBorder drop-shadow-sm p-2 rounded-lg border-[1px] border-lightBorder'>
                            <p className='text-gray-500 uppercase text-xs'>{x.trait_type}</p>
                            <p className='text-white text-sm'>{convertHexToString(x.value)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default NFTModal
