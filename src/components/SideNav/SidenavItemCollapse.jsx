import { Transition } from '@headlessui/react'
import Avatar from 'components/Avatar'
import { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

//ჩამოსაშლელი მენიუს კომპონენტი
const SidenavItemCollapse = ({ icon, name, path, pathname, collapse }) => {
  const [collapsed, setIsCollapsed] = useState(false)
  const collapseName = pathname.split('/').slice(1)[0]
  const active = path === `/${collapseName}`
  const renderCollapse = collapse.map(({ name, key, path }) => {
    let returnValue
    returnValue = (
      <NavLink key={key} exact='true' to={path}>
        <div className='duration-150 hover:bg-lightHover  rounded-lg p-2 cursor-pointer'>
          <p className={`text-lightText  duration-150 text-sm ${path === pathname ? 'bg-lightHover  p-2 rounded-lg' : ''}`}>{name}</p>
        </div>
      </NavLink>
    )
    return returnValue
  })

  return (
    <div className='py-1'>
      <div
        className={`${active ? 'bg-lightHover  shadow-lg' : ''} flex items-center justify-between cursor-pointer duration-150 hover:bg-lightHover  w-full h-[50px] px-2 rounded-lg`}
        onClick={() => (collapsed === name ? setIsCollapsed(!collapsed) : setIsCollapsed(!collapsed))}>
        <div className='flex items-center space-x-2'>
          <div className={`w-[28px] h-[28px] ${active ? 'bg-primary' : 'bg-lightBorder'} duration-150 rounded-md flex items-center justify-center shadow`}>
            <Avatar src={icon} alt={name} className={`${name === 'Bitcoin' || name === 'EVM' ? 'w-2.5' : 'w-4'}`} />
          </div>
          <h1 className={`${active ? 'text-lightText ' : 'text-lightText '} duration-150 text-sm `}>{name}</h1>
        </div>
        {collapsed ? <IoIosArrowUp className='text-primary ' /> : <IoIosArrowDown className='text-primary ' />}
      </div>
      <Transition
        show={collapsed}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 -translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 -translate-y-1'>
        <div>
          <div className='mt-2'>{renderCollapse}</div>
        </div>
      </Transition>
    </div>
  )
}

export default SidenavItemCollapse
