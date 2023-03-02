import React from 'react'

const BodyTd = ({ children, isLast, rightCorner, leftCorner }) => {
  return (
    <td className={`duration-150 ${isLast && 'border-b border-lightBorder'} ${rightCorner && 'rounded-bl-lg'} ${leftCorner && 'rounded-br-lg'} px-6 py-4`}>
      {children}
    </td>
  )
}

export default BodyTd