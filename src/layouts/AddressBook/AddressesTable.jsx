import React, { useEffect, useState } from 'react'
import Card from 'components/Cards/Card'
import Typography from 'components/Typography'
import Input from 'components/Input'
import Button from 'components/Button'
import Modal from 'components/Modal'
import AddressComponent from 'components/CryptoComponents/AddressComponent'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import { supportedChains } from 'config'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'

const AddressesTable = ({ updated }) => {
  const [open, setOpen] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addressToEdit, setAddresToEdit] = useState([])

  const getSavedAddresses = () => {
    var addressesList = JSON.parse(localStorage.getItem('addressBook'))
    if (addressesList === null) {
      addressesList = []
    } else {
      setAddresses(addressesList)
    }
  }

  const deleteAddress = (index) => {
    const addressesList = JSON.parse(localStorage.getItem('addressBook'))
    addressesList.splice(index, 1)
    localStorage.setItem('addressBook', JSON.stringify(addressesList))
    getSavedAddresses()
  }

  const openEditModal = (index) => {
    const addressesList = JSON.parse(localStorage.getItem('addressBook'))
    setAddresToEdit([addressesList[index], index])
    setOpen(!open)
  }

  const editAddress = (index) => {
    const addressesList = JSON.parse(localStorage.getItem('addressBook'))

    const getEditedChain = document.getElementById('editedAddressChain').value
    const getWalletName = document.getElementById('editedWalletName').value
    const getWalletAddress = document.getElementById('editedWalletAddress').value

    addressesList[index].chain = String(getEditedChain).toUpperCase()
    addressesList[index].walletName = getWalletName
    addressesList[index].walletAddress = getWalletAddress
    localStorage.setItem('addressBook', JSON.stringify(addressesList))

    getSavedAddresses()
    setOpen(!open)
  }

  useEffect(() => {
    getSavedAddresses()
  }, [updated])

  return (
    <div className='rounded-lg'>
      {Object.keys(addresses).length > 0 ? (
        <Card>
          <div className='overflow-y-auto'>
            <Table>
              <Thead>
                <HeadTr>
                  <HeadTh>
                    ქსელი
                  </HeadTh>
                  <HeadTh>
                    სახელი
                  </HeadTh>
                  <HeadTh>
                    მისამართი
                  </HeadTh>
                  <HeadTh>
                  </HeadTh>
                </HeadTr>
              </Thead>
              <Tbody>
                {addresses.map((x, index) => (
                  <BodyTr key={index}>
                    <BodyTd isLast={index !== addresses.length - 1} rightCorner={index === addresses.length - 1}>
                      <Typography className='font-light'>{x.chain}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== addresses.length - 1}>
                      <Typography className='font-light'>{x.walletName}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== addresses.length - 1}>
                      <AddressComponent address={x.walletAddress} type='wallet' chain={x.chain} chainId={x.chainId} />
                    </BodyTd>
                    <BodyTd isLast={index !== addresses.length - 1} leftCorner={index === addresses.length - 1}>
                      <div className='flex flex-row items-center gap-2'>
                        <AiFillEdit onClick={() => openEditModal(index)} className='text-yellow-400 duration-150 hover:scale-110 text-xl' />
                        <AiFillDelete onClick={() => deleteAddress(index)} className='text-red-500 duration-150 hover:scale-110 text-xl' />
                      </div>
                    </BodyTd>
                  </BodyTr>
                ))}
              </Tbody>
            </Table>
          </div>
        </Card>
      ) : null}
      <Modal title='მისამართის ჩასწორება' open={open} close={() => setOpen(!open)}>
        <div className='p-2'>
          {Object.keys(addressToEdit).length > 0 && (
            <div>
              <div>
                <div>
                  <Typography>ქსელი:</Typography>
                  <select id='editedAddressChain' defaultValue={addressToEdit[0].chain} className='duration-150 py-2 bg-darkHover border border-lightBorder rounded-lg p-2 w-full text-lightText bg-lightCard text-darkText focus:outline-none'>
                    {supportedChains.map((x) => (
                      <option key={x.networkName} value={x.networkSymbol}>
                        {x.networkName}{' '}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='mt-3'>
                <Typography>სახელი:</Typography>
                <Input type='text' id='editedWalletName' placeholder='სახელი' defaultValue={addressToEdit[0].walletName} />
              </div>
              <div className='mt-3'>
                <Typography>მისამართი:</Typography>
                <Input type='text' id='editedWalletAddress' placeholder='საფულის მისამართი' defaultValue={addressToEdit[0].walletAddress} />
              </div>
              <div className='mt-2'>
                <Button onClick={() => editAddress(addressToEdit[1])}>ჩასწორება</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default AddressesTable
