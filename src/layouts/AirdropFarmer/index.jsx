import Avatar from 'components/Avatar'
import Card from 'components/Cards/Card'
import Typography from 'components/Typography'
import { AirdropsList } from './airdrops'
import { BsTwitter, BsDiscord, BsGlobe } from 'react-icons/bs'
const Index = () => {
  return (
    <div>
      {AirdropsList.map((x) => (
        <div className='w-full md:w-[450px]'>
          <Card title={x.name} titleBorder={true}>
            <div className='p-2'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-2'>
                  <div className='bg-lightBorder p-1 rounded-lg drop-shadow-md flex'>
                    <Avatar src='https://pbs.twimg.com/profile_images/1523593944386326528/rVjsezsD_400x400.jpg' alt='Scroll_Logo' className='rounded-lg w-11' />
                  </div>
                  <div className='flex flex-col'>
                    <Typography className='text-sm'>{x.name}</Typography>
                    <Typography className='text-sm'>{x.stage}</Typography>
                    <div className='flex items-center gap-2'>
                      <a href={x.website} target='_blank' rel='noreferrer'>
                        <BsGlobe className='text-[#ADD8E6] text-sm' />
                      </a>
                      <a href={x.twitter} target='_blank' rel='noreferrer'>
                        <BsTwitter className='text-[#00acee]' />
                      </a>
                      <a href={x.discord} target='_blank' rel='noreferrer'>
                        <BsDiscord className='text-[#7289da]' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='border-[1px] border-lightBorder'></div>
            <div className='p-2'>
              {x.tasks.map((y) => (
                <div>
                  <Typography className='text-sm'>{y}</Typography>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default Index
