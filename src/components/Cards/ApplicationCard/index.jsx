import Avatar from 'components/Avatar'
import Button from 'components/Button'
import Card from 'components/Cards/Card'

const index = ({ name, category, description, link, logo }) => {
  return (
    <Card className='p-2'>
      <div className='flex items-center space-x-2'>
        <Avatar src={logo} alt={name} className='w-12 rounded-lg' />
        <div>
          <p className='text-lightText  font-bold'>{name}</p>
          <p className='text-lightText  text-sm'>{category}</p>
        </div>
      </div>
      <p className='text-lightText  py-3 text-sm'>{description}</p>
      <div className='flex justify-center'>
        <a href={link} target='blank' className='w-full'>
          <Button>საიტის ნახვა</Button>
        </a>
      </div>
    </Card>
  )
}

export default index
