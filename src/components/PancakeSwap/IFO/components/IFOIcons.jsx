import Avatar from 'components/Avatar'

const IFOIcons = ({ name, token, tokenPrice, tokenAddress }) => {
  return (
    <div className='flex items-center gap-2'>
      <Avatar src={`https://pancakeswap.finance/images/tokens/${tokenAddress}.png`} alt={name} className='w-10' />
      <div className='text-lightText'>
        <p className='text-lightText'>{name}</p>
        <div className='flex items-center gap-1'>
          <p className=''>{Number(token) > 0 ? Number(token).toFixed(4) : '0.000'}</p>
          <p className='text-sm'>({`$${(Number(token) * Number(tokenPrice)).toLocaleString('en-US')}`})</p>
        </div>
      </div>
    </div>
  )
}

export default IFOIcons
