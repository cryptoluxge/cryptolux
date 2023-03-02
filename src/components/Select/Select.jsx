import React from 'react'

const index = ({ defaultValue, children, ...rest }) => {
  return (
    <div>
      <select {...rest} defaultValue={defaultValue} className='duration-150 py-2 bg-lightCard border border-lightBorder rounded-lg p-2 w-full text-lightText focus:outline-none cursor-pointer disabled:cursor-not-allowed'>
        {children}
      </select>
    </div>
  )
}

export default index