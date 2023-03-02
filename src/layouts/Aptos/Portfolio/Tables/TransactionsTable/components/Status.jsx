import Typography from 'components/Typography'

const Status = ({ status }) => {
  return (
    <div>
      <div className={`${status ? 'bg-green-500/10' : 'bg-red-500/10'} p-1 rounded-lg text-center`}>
        <Typography color={`${status ? 'text-green-500' : 'text-red-500'}`}>{status ? 'Success' : 'Failed'}</Typography>
      </div>
    </div>
  )
}

export default Status
