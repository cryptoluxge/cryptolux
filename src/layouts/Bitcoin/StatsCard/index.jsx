import Card from 'components/Cards/Card'
import Skelaton from 'components/Skelaton'
import Typography from 'components/Typography'

const MiniCard = ({ title, data, percent, isError, isLoading }) => {
  return (
    <Card className='p-2'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-lightText font-light text-sm'>{title}</p>
          {!isLoading ? (
            <div>
              {isError === true ? (
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-white text-xl font-bold tracking-wider'>${Number(data).toLocaleString('en-US')}</p>
                    <Typography className={`${Number(percent) > 0 ? 'bg-green-600' : 'bg-red-600'} px-2 py-0.5 rounded-lg`} color='text-white'>
                      {String(percent)}%
                    </Typography>
                  </div>
                </div>
              ) : (
                <div>
                  <Typography color='text-red-500'>API კავშირი ვერ მოხერხდა!</Typography>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Skelaton width='full' />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default MiniCard
