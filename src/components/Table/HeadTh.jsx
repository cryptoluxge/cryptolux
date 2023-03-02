import React from 'react'

const HeadTh = ({ children }) => {
  return (
    <th scope='col' className='duration-150 border-b border-lightBorder px-6 py-3'>
      {children}
    </th>
  )
}

export default HeadTh