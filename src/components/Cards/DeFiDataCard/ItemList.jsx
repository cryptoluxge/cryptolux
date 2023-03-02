const ItemList = ({ name, data }) => {
  return (
    <div>
      <div className='flex items-center justify-between duration-150 hover:bg-lightHover'>
        <p className='text-lightText'>{name}</p>
        <p className='text-lightText'>{data}</p>
      </div>
      <div className='border-[1px] border-lightBorder'></div>
    </div>
  )
}

export default ItemList
