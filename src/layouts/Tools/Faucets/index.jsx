import React from 'react'
import Card from 'components/Cards/Card'
import Button from 'components/Button'
import Avatar from 'components/Avatar'
import Typography from 'components/Typography'
import { faucetLists } from './faucets'

const index = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 w-full'>
      {faucetLists.map((x) => (
        <Card title={x.name} titleBorder={true}>
          <div className='p-2'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <div className='bg-lightBorder p-1 rounded-lg drop-shadow-md flex'>
                  <Avatar src={x.logo} alt={x.name} className='rounded-lg w-10' />
                </div>
                <div className='flex flex-col'>
                  <Typography className='text-sm'>{x.name}</Typography>
                  <Typography className='text-xs'>{x.description}</Typography>
                </div>
              </div>
              <div>
                <a href={x.website} target='_blank' rel='noreferrer'>
                  <Button>გადასვლა</Button>
                </a>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default index
