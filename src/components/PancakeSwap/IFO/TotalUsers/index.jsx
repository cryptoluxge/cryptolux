import Card from 'components/Cards/Card'
import { ifo } from 'config/BNBChain/PancakeSwap/constants/ifo'
import { useEffect, useRef, useState } from 'react'

const Index = () => {
  const mountedRef = useRef(true)
  const [users, setUsers] = useState()

  const getUserParticipated = async () => {
    const urlToFetch = `https://deep-index.moralis.io/api/v2/${ifo[0].poolContract}/erc20/transfers?chain=bsc&from_block=${ifo[0].startBlock}&to_block=${ifo[0].endBlock}`
    fetch(urlToFetch, {
      headers: {
        'X-API-Key': 'l7H7MfYwlfi1e7MjCpxbWsEWzLTudxOmgxJl4HvNixTrUduN1dZRHyW9ehyN4PXK',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.total)
      })
  }

  useEffect(() => {
    getUserParticipated()

    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className='mt-4'>
      <Card className='p-3'>
        <div className='flex items-center gap-1'>
          <p className='text-lightText'>Private და Public Sale-ში მონაწილეობა მიიღო</p>
          <p className='text-lightText '>{users} ადამიანმა</p>
        </div>
      </Card>
    </div>
  )
}

export default Index
