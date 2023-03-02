import { AiFillCheckCircle, AiFillCloseCircle, AiFillWarning } from 'react-icons/ai'
import { MdInfo } from 'react-icons/md'
import { shortAddress } from 'utils/WalletHelpers'
import { getExplorerURL } from 'utils/getExplorerURL'

const index = ({ variant, text, type, balance }) => {
  return (
    <div>
      {variant === 'info' ? (
        <div className='flex p-3 text-sm bg-teal-600/20 rounded-lg border-[1px] border-teal-300/20 shadow-md' role='alert'>
          <MdInfo className='text-teal-500 inline flex-shrink-0 text-[20px] mr-2' />
          <span className='sr-only'>Info</span>
          <div className='flex flex-col'>
            <div>
              <p className='text-sm w-full font-light text-teal-400'>{text}</p>
            </div>
            {balance && <div>{balance > 0 ? <p className='text-sm w-full font-light text-teal-400'>ბალანსი: {balance}</p> : <p className='text-sm w-full font-light text-teal-400'>Balance: 0</p>}</div>}
          </div>
        </div>
      ) : null}
      {variant === 'success' ? (
        <div className='flex p-3 text-sm bg-green-600/20 rounded-lg border-[1px] border-green-300/20 shadow-md' role='alert'>
          <AiFillCheckCircle className='text-green-500 inline flex-shrink-0 text-[20px] mr-2' />
          <span className='sr-only'>success</span>
          <div className='flex flex-col'>
            <div>
              <a href={getExplorerURL('APT', 0, 'wallet', text)} target='_blank' rel='noreferrer' className='underline text-sm w-full font-light text-green-400'>
                {shortAddress(text, 6)}
              </a>
            </div>
            {type !== 'nft' && <p className='text-sm w-full font-light text-green-400'>ბალანსი: {balance}</p>}
          </div>
        </div>
      ) : null}
      {variant === 'warning' ? (
        <div className='flex p-3 text-sm bg-yellow-600/20 rounded-lg border-[1px] border-yellow-300/20 shadow-md' role='alert'>
          <AiFillWarning className='text-yellow-500 inline flex-shrink-0 text-[20px] mr-2' />
          <span className='sr-only'>warning</span>
          <div className='flex flex-col'>
            <div>
              <p className='text-sm w-full font-light text-yellow-400'>{text}</p>
            </div>
          </div>
        </div>
      ) : null}
      {variant === 'error' ? (
        <div className='flex p-3 text-sm bg-red-600/20 rounded-lg border-[1px] border-red-300/20 shadow-md' role='alert'>
          <AiFillCloseCircle className='text-red-500 inline flex-shrink-0 text-[20px] mr-2' />
          <span className='sr-only'>error</span>
          <div className='flex flex-col'>
            <div>
              <p className='text-sm w-full font-light text-red-400'>{text}</p>
            </div>
            {balance && <div>{balance > 0 ? <p className='text-sm w-full font-light text-red-400'>ბალანსი: {balance}</p> : <p className='text-sm w-full font-light text-red-400'>Balance: 0</p>}</div>}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default index
