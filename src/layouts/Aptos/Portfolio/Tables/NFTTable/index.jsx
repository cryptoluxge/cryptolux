import Alert from 'components/Alerts'
import LoadingPulse from 'components/Skelaton'
import Typography from 'components/Typography'
import { useState } from 'react'
import { BiListUl } from 'react-icons/bi'
import { HiOutlineViewGrid } from 'react-icons/hi'
import NFTCard from './components/NFTCard'
import TableView from './components/NFTTable'

const Index = ({ data, isChecking }) => {
  const [gridView, setGridView] = useState(true)
  return (
    <div>
      <div className={`${gridView ? '' : ''}`}>
        {Object.keys(data).length > 0 ? (
          <div>
            {data.data[0].data.length > 0 ? (
              <div className={`${isChecking ? 'max-h-[500px] overflow-y-auto rounded-lg' : ''}`}>
                <div>
                  <div className={`p-2 flex items-center justify-between`}>
                    <Typography className='text-sm'>NFT რაოდენობა: {data.status === 200 && data.data[0].count}</Typography>
                    <div className='flex items-center gap-1'>
                      <BiListUl onClick={() => setGridView(false)} className='text-white text-2xl cursor-pointer' />
                      <HiOutlineViewGrid onClick={() => setGridView(true)} className='text-white text-xl cursor-pointer' />
                    </div>
                  </div>
                  <div className='border-[1px] border-lightBorder'></div>
                  {gridView ? (
                    <div className='p-2'>
                      <NFTCard data={data} isChecking={isChecking} />
                    </div>
                  ) : (
                    <div>
                      <TableView data={data} isChecking={isChecking} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='p-2'>
                <Alert variant='info' text='ბალანსზე NFT არ გაქვთ.' />
              </div>
            )}
          </div>
        ) : (
          <div>
            <LoadingPulse width='full' />
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
