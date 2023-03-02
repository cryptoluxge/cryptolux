import TableView from './Table'

const index = ({ data, isChecking }) => {
  return (
    <div>
      <TableView data={data} isChecking={isChecking} />
    </div>
  )
}

export default index
