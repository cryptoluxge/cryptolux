import React from 'react'

const Option = ({value, children, ...rest}) => {
  return (
    <option {...rest} value={value}>{children}</option>
  )
}

export default Option