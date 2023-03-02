import Card from './Card'

const index = ({ data, isChecking }) => {
  return (
    <div>
      {data.status === 200 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2'>
          {data.data[0].data.map((x, index) => (
            <div key={index}>
              <Card data={x} isChecking={isChecking} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default index
