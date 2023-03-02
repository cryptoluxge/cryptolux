import Card from 'components/Cards/Card'

const index = ({ title, children }) => {
  return (
    <Card title={title}>
      <div className='mt-2'>{children}</div>
    </Card>
  )
}

export default index
