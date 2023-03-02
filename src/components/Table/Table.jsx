const Table = ({ children }) => {
  return (
    <div>
      <div className='overflow-y-auto'>
        <table className='border-collapse table-auto w-full text-sm text-left '>
          {children}
        </table>
      </div>
    </div>
  )
}

export default Table