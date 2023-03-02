import { Transition } from '@headlessui/react'
import Logo from 'assets/images/logo.png'
import Navbar from 'components/ConnectWallet/Ethereum'
import { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { GiHamburgerMenu } from 'react-icons/gi'
import { menuItem } from '../../routes'
import Avatar from '../Avatar'
import SidenavItem from './SidenavItem'

const Index = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Transition
        show={isOpen}
        className='fixed h-screen flex md:hidden mt-12 z-50'
        enter='transition ease-in-out duration-300 transform'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition ease-in-out duration-300 transform'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'>
        <div className='z-50 inset-0 w-[250px] h-screen overflow-y-auto p-3 mt-[-50px] bg-lightBackground  rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-90 shadow'>
          <div className='flex items-center justify-between'>
            <a href='/'>
              <div className='flex items-center space-x-3 cursor-pointer'>
                <Avatar src={Logo} alt='კრიპტოლუქსის ლოგო' className='w-9' />
                <p className='text-lightText  text-sm'>კრიპტოლუქსი</p>
              </div>
            </a>
            <div className='group duration-75 hover:bg-primary rounded-lg p-2 cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
              <AiOutlineClose className='text-lightText  group-hover:text-white text-xl' />
            </div>
          </div>
          <div className='border-[1px] rounded-full w-full mt-3 border-primary shadow-xl shadow-primary'></div>
          <div>
            <div className='mt-3'>
              <SidenavItem menuItem={menuItem} />
            </div>
          </div>
        </div>
      </Transition>
      <div className='md:flex'>
        <div className='hidden md:flex h-screen sticky overflow-y-auto top-0 flex-col p-4 duration-150 border-r border-lightHover min-h-screen min-w-[300px]'>
          <a href='/'>
            <div className='flex items-center space-x-3 cursor-pointer'>
              <Avatar src={Logo} alt='კრიპტოლუქსის ლოგო' className='w-9' />
              <p className='text-lightText  text-sm'>კრიპტოლუქსი</p>
            </div>
          </a>
          <div className='border-[1px] rounded-full w-full mt-3 border-primary shadow-xl shadow-primary'></div>
          <div className='mt-3'>
            <SidenavItem menuItem={menuItem} />
          </div>
        </div>
        <main className='w-full'>
          <div className='flex justify-between md:justify-end'>
            <div className='flex items-center md:hidden px-2'>
              {isOpen ? (
                <div className='duration-150 hover:bg-primary rounded-lg p-3 cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                  <AiOutlineClose className='text-lightText  text-xl ' />
                </div>
              ) : (
                <div className='duration-150 hover:bg-primary rounded-lg group p-3 cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                  <GiHamburgerMenu className='group group-hover:text-white text-lightText  text-xl' />
                </div>
              )}
            </div>
            <div className='flex items-center'>
              <Navbar />
            </div>
          </div>
          <div className='px-3 grid grid-cols-1 w-full'>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Index
