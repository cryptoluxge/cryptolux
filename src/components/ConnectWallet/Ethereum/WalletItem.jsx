import Avatar from 'components/Avatar'

const WalletItem = ({ name, icon, isInstalled }) => {
  return (
    <button disabled={!isInstalled} className='disabled:bg-zinc-900 w-full disabled:cursor-not-allowed group flex justify-between items-center px-3 py-2 bg-lightBorder  rounded-lg duration-200 hover:bg-primary'>
      <div className='flex items-center'>
        <Avatar disabled={!isInstalled} src={icon} alt='' className='w-5 disabled:grayscale' />
        <div disabled={!isInstalled} className='flex-1 ml-3 disabled:text-zinc-900 text-lightText group-hover:text-white disabled:group-hover:text-lightText text-sm'>{name}</div>
      </div>
      {!isInstalled && <span className='inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs text-white  font-medium bg-red-800 rounded-md'>არ არის დაყენებული</span>}
    </button>
  )
}

export default WalletItem
