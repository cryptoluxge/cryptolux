import Card from './Card'
import Skelaton from 'components/Skelaton'

const MiniCard = ({ title, data, icon, isLoading }) => {
  return (
    <Card className='p-2'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-lightText font-light'>{title}</p>
          {!isLoading ? (
            <p className='text-lightText'>{data}</p>
          ) : (
            <div>
              <Skelaton width='full' />
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-md bg-primary flex justify-center items-center`}>{icon}</div>
      </div>
    </Card>
  )
}

export default MiniCard
