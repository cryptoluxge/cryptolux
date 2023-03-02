import Card from 'components/Cards/Card'
import AddressComponent from 'components/CryptoComponents/AddressComponent'
import Modal from 'components/Modal'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { useEffect, useState } from 'react'
import { HiUserAdd } from 'react-icons/hi'
import { TbAddressBook } from 'react-icons/tb'

const Index = ({ inputId }) => {
  const [open, setOpen] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])

  const getSavedAddresses = () => {
    var addressesList = JSON.parse(localStorage.getItem('addressBook'))
    if (addressesList === null) {
      setSavedAddresses([])
    } else {
      setSavedAddresses(addressesList)
    }
  }

  useEffect(() => {
    getSavedAddresses()
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <div className='flex'>
        <div onClick={() => setOpen(!open)} className='cursor-pointer duration-150 hover:scale-105'>
          <Card>
            <div className='flex items-center justify-center p-2'>
              <TbAddressBook className='text-2xl text-primary' />
            </div>
          </Card>
        </div>
      </div>
      <Modal title='შენახული მისამართები' open={open} close={() => setOpen(!open)}>
        <div>
          {savedAddresses.length > 0 ? (
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
                </HeadTr>
              </Thead>
              <Tbody>
                {savedAddresses.map((x, index) => (
                  <BodyTr key={index}>
                    <BodyTd isLast={index !== savedAddresses.length - 1} rightCorner={index === savedAddresses.length - 1}>
                      <Typography>{x.chain}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== savedAddresses.length - 1} >
                      <Typography>{x.walletName}</Typography>
                    </BodyTd>
                    <BodyTd isLast={index !== savedAddresses.length - 1} leftCorner={index === savedAddresses.length - 1}>
                      <AddressComponent address={x.walletAddress} type='wallet' chain={x.chain} chainId={x.chainId} />
                    </BodyTd>
                  </BodyTr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <div className='p-3 py-6 flex items-center justify-center'>
              <a href='/address-book' target='_blank' rel='noreferrer'>
                <Typography className='text-primary flex items-center gap-3'>
                  <HiUserAdd className='text-xl' />
                  დაამატე მისამართი
                </Typography>
              </a>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Index
