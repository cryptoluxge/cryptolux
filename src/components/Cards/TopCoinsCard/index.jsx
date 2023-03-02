import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'

const index = ({ logoURL, name, symbol, price, percentage }) => {
  return (
    <div className={`rounded-lg shadow-sm ${Number(percentage) > 0 ? 'shadow-green-500' : 'shadow-red-500'}`}>
      <Card>
        <div className='p-2'>
          <div className='flex items-center gap-2'>
            <div>
              <Avatar src={logoURL} alt={symbol} className='w-8 rounded-full' />
            </div>
            <div>
              <p className='text-lightText'>
                {name} ({String(symbol).toUpperCase()})
              </p>
              <div className='flex gap-1'>
                <p className='text-lightText  font-bold'>${Number(price).toLocaleString('en-US')}</p>
                <p className={`text-xs ${Number(percentage) > 0 ? 'text-green-500' : 'text-red-500'}`}>{Number(percentage).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default index
