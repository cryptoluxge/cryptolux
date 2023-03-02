import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'

const index = ({ name, social, description, link, logo }) => {
  return (
    <Card className='p-3'>
      <div className='flex items-center space-x-2'>
        <Avatar src={logo} alt={name} className='w-12 rounded-lg' />
        <div>
          <p className='text-lightText  font-bold'>{name}</p>
          <p className='text-lightText  text-xs'>{social}</p>
        </div>
      </div>
      {description === '' ? null : <p className='text-lightText  mt-3 mb-3'>{description}</p>}
      <div className='flex justify-center'>
        <a href={link} target='blank' className='w-full'>
          <Button>გადასვლა</Button>
        </a>
      </div>
    </Card>
  )
}

export default index
