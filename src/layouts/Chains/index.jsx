import React, { useState } from 'react'
import ChainCard from 'components/Cards/ChainCard'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { networks } from './BlockchainList'

const Index = () => {
  const [isMainnetOpened, setIsMainnetOpened] = useState(true)
  const [isTestnetOpened, setIsTestnetOpened] = useState(true)

  return (
    <div>
      {/* MAINNET */}
      <div>
        <div>
          <div className='flex justify-between items-center'>
            <p className='text-lightText text-xl'>MAINNET - ქსელები</p>
            {isMainnetOpened ? (
              <BsFillArrowDownCircleFill onClick={() => setIsMainnetOpened(!isMainnetOpened)} className='text-primary text-2xl cursor-pointer' />
            ) : (
              <BsFillArrowUpCircleFill onClick={() => setIsMainnetOpened(!isMainnetOpened)} className='text-primary text-2xl cursor-pointer' />
            )}
          </div>
          <div className='border-[1px] border-primary w-full mb-3 mt-3'></div>
        </div>
        {isMainnetOpened && (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full'>
            {networks.mainnet.map((x) => (
              <div key={x.name}>{x.type === 'Mainnet' && <ChainCard type={x.type} key={x.chainId} name={x.name} logo={x.logo} symbol={x.symbol} chainId={x.chainId} action={x.action} />}</div>
            ))}
          </div>
        )}
      </div>
      {/* TESTNET */}
      <div className='mt-3'>
        <div>
          <div className='flex justify-between items-center'>
            <p className='text-lightText  text-xl'>TESTNET - ქსელები</p>
            {isTestnetOpened ? (
              <BsFillArrowDownCircleFill onClick={() => setIsTestnetOpened(!isTestnetOpened)} className='text-primary text-2xl cursor-pointer' />
            ) : (
              <BsFillArrowUpCircleFill onClick={() => setIsTestnetOpened(!isTestnetOpened)} className='text-primary text-2xl cursor-pointer' />
            )}
          </div>
          <div className='border-[1px] border-primary w-full mb-3 mt-3'></div>
        </div>
        <div>
          {isTestnetOpened && (
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full'>
              {networks.testnet.map((x) => (
                <div key={x.name}>{x.type === 'Testnet' && <ChainCard type={x.type} key={x.chainId} name={x.name} logo={x.logo} symbol={x.symbol} chainId={x.chainId} action={x.action} />}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
