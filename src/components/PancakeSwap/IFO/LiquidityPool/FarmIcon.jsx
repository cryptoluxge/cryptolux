import Avatar from 'components/Avatar'

const Index = ({ token0Address, token1Address }) => {
  return (
    <div>
      <div className='flex -space-x-4'>
        <Avatar src={`https://pancakeswap.finance/images/tokens/${token1Address}.png`} alt='' className='w-10 md:w-10 border border-gray-400 rounded-full' />
        <Avatar src={`https://pancakeswap.finance/images/tokens/${token0Address}.png`} alt='' className='w-10 md:w-10 border border-gray-400 rounded-full' />
      </div>
    </div>
  )
}

export default Index
