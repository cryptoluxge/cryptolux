import React from 'react'
import { shortAddress } from 'utils/WalletHelpers'
import { getExplorerURL } from 'utils/getExplorerURL'
import { MdOutlineOpenInNew } from 'react-icons/md'
import { BiCopy } from 'react-icons/bi'
import { useToast } from 'hooks/useToast'
import { useState, useEffect } from 'react'

const AddressComponent = ({ address, type, chain, chainId }) => {
  const [setChain, setSetChain] = useState('')
  const toast = useToast()

  const chainType = () => {
    if (chain === 'APT') {
      setSetChain('APT')
    } else if (chain === 'ADA') {
      setSetChain('ADA')
    } else if (chain === 'MINA') {
      setSetChain('MINA')
    } else {
      setSetChain('evm')
    }
  }

  const copyData = () => {
    let addressType = ''
    if (type === 'wallet') {
      addressType = 'საფულის მისამართი:'
    } else if (type === 'token') {
      addressType = 'კონტრაქტის მისამართი:'
    } else if (type === 'tx') {
      addressType = 'ტრანზაქციის ჰეში:'
    } else {
      addressType = ''
    }

    try {
      navigator.clipboard.writeText(address)
      toast('success', 'დაკოპირდა', `${addressType} ${shortAddress(address, 12)}`)
    } catch (error) {
      toast('error', 'კოპირება ვერ მოხერხდა')
    }
  }

  useEffect(() => {
    chainType()
    // eslint-disable-next-line
  }, [])

  return (
    <div className='flex items-center gap-1'>
      <a href={getExplorerURL(setChain, chainId, type, address)} target='_blank' rel='noreferrer' className='flex items-center gap-1'>
        <p className='text-md text-primary font-light'>{shortAddress(address, 4)}</p>
        <MdOutlineOpenInNew className='text-md text-primary' />
      </a>
      <div onClick={() => copyData()} className='flex'>
        <BiCopy className='text-md text-primary cursor-pointer' />
      </div>
    </div>
  )
}

export default AddressComponent
