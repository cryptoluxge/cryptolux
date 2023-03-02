import React, { useState } from 'react'
import Card from 'components/Cards/Card'
import Button from 'components/Button'
import Input from 'components/Input'
import AddressesTable from './AddressesTable'
import { Select, Option } from 'components/Select'
import { supportedChains, supportedChainsList } from 'config'
import { useToast } from 'hooks/useToast'

const Index = () => {
  const [isUpdated, setIsUpdated] = useState(0)
  const toast = useToast()

  const saveAddress = () => {
    var existingAddresses = JSON.parse(localStorage.getItem('addressBook'))
    if (existingAddresses === null) existingAddresses = []

    const getWalletChain = document.getElementById('addressChain').value
    const getWalletChainId = supportedChainsList[getWalletChain].chainId
    const getWalletChainType = supportedChainsList[getWalletChain].chainType
    const getWalletName = document.getElementById('walletName').value
    const getWalletAddress = document.getElementById('walletAddress').value

    if (getWalletChain !== 'selectChain') {
      if (getWalletName !== '') {
        if (getWalletAddress !== '') {
          const result = { chain: String(getWalletChain).toUpperCase(), walletName: getWalletName, walletAddress: getWalletAddress, chainId: getWalletChainId, chainType: getWalletChainType }
          localStorage.setItem('entry', JSON.stringify(result))
          existingAddresses.push(result)
          localStorage.setItem('addressBook', JSON.stringify(existingAddresses))
          setIsUpdated(isUpdated + 1)
        } else {
          toast('error', 'შეიყვანეთ საფულის მისამართი')
        }
      } else {
        toast('error', 'შეიყვანეთ სახელი')
      }
    } else {
      toast('error', 'აირჩიეთ ქსელი')
    }
  }

  return (
    <div className='flex flex-col md:flex-row justify-center gap-2'>
      <div className='w-full md:w-[350px]'>
        <Card title='საფულის დამატება წიგნაკში' titleBorder={true}>
          <div className='p-2'>
            <div>
              <Select id='addressChain' defaultValue='აირჩიეთ ქსელი'>
                <Option value='selectChain'>აირჩიეთ ქსელი</Option>
                {supportedChains.map((x) => (
                  <Option key={x.networkName} value={x.networkSymbol}>
                    {x.networkName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className='mt-2'>
              <Input id='walletName' placeholder='საფულის სახელი' />
            </div>
            <div className='mt-2'>
              <Input id='walletAddress' placeholder='საფულის მისამართი' />
            </div>
            <div className='mt-2'>
              <Button onClick={() => saveAddress()}>დამატება</Button>
            </div>
          </div>
        </Card>
      </div>
      <AddressesTable updated={isUpdated} />
    </div>
  )
}

export default Index
