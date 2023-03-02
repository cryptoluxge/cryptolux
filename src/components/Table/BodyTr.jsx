import React from 'react'

const BodyTr = ({ children, ...rest }) => {
  return (
    <tr {...rest} className={`w-full cursor-pointer duration-150 hover:bg-lightHover rounded-lg`}>
      {children}
    </tr>
  )
}

export default BodyTr