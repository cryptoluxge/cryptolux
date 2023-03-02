import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'

const index = ({ type, name, chainId, symbol, logo, action }) => {
  return (
    <Card className='p-2'>
      <div className='flex items-center space-x-2'>
        <div className='w-[40px] h-[40px] bg-primary rounded-lg shadow-md flex items-center justify-center'>
          <Avatar src={logo} alt={name} className='w-5' />
        </div>
        <div>
          <p className='text-lightText font-bold'>{name}</p>
          <p className='text-lightText'>{type}</p>
        </div>
      </div>
      <div className='py-3'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-lightText'>Chain ID</p>
            <p className='text-lightText font-bold'>{chainId}</p>
          </div>
          <div>
            <p className='text-lightText'>Symbol</p>
            <p className='text-lightText font-bold'>{symbol}</p>
          </div>
        </div>
      </div>
      <div>{action}</div>
    </Card>
  )
}

export default index
