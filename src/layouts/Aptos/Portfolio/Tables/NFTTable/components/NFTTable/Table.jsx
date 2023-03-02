import AddressComponent from 'components/CryptoComponents/AddressComponent'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useState } from 'react'
import { getNftDetails } from 'utils/Helpers/AptosHelpers/NFTHelpers'
import NFTImage from '../NFTImage'
import NFTModal from '../NFTModal'

const TableView = ({ data, isChecking }) => {
  const [open, setOpen] = useState(false)
  const [nftAttributes, setNftAttributes] = useState([])
  const [selected, setSelected] = useState([])

  const openModal = async (selectedNft) => {
    setSelected([])
    setNftAttributes([])
    setOpen(!open)
    const getTest = await getNftDetails(selectedNft.current_token_data.metadata_uri)
    setSelected(selectedNft)
    setNftAttributes(getTest)
  }

  return (
    <div>
      <Table>
        <Thead>
          <HeadTr>
            <HeadTh>სახელი</HeadTh>
            <HeadTh>კონტრაქტი</HeadTh>
          </HeadTr>
        </Thead>
        <Tbody>
          {data.data[0].data.map((x, index) => (
            <BodyTr onClick={() => openModal(x)} key={x.current_token_data.name} >
              <BodyTd isLast={index !== data.data[0].data.length - 1} rightCorner={index === data.data[0].data.length - 1}>
                <div className='flex items-center gap-2'>
                  <div className='flex-shrink-0'>
                    <NFTImage nftData={x} type='table' />
                  </div>
                  <div className='flex flex-col'>
                    <Typography className='font-light whitespace-nowrap'>{x.current_token_data.name}</Typography>
                    <Typography className='font-light text-sm' color='text-gray-500'>
                      {x.current_token_data.collection_name}
                    </Typography>
                  </div>
                </div>
              </BodyTd>
              <BodyTd isLast={index !== data.data[0].data.length - 1} leftCorner={index === data.data[0].data.length - 1}>
                <AddressComponent address={x.current_token_data.creator_address} chain='APT' type='wallet' />
              </BodyTd>
            </BodyTr>
          ))}
        </Tbody>
      </Table>
      {Object.keys(nftAttributes).length === 0 && Object.keys(selected).length === 0 ? null : <NFTModal data={selected} nftAttributes={nftAttributes} isChecking={isChecking} modalOpen={open} modalClose={() => setOpen(!open)} />}
    </div>
  )
}

export default TableView
