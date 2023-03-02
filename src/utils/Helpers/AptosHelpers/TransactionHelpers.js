import BigNumber from 'bignumber.js'
import Typography from 'components/Typography'

export const getAddressFromFunctionId = (id) => {
  const result = String(id).split('::')[0]
  return result
}

export const getFunctionFromFunctionId = (id) => {
  if (String(id) === '0x1::aptos_account::transfer') {
    const result = 'Coin Transfer'
    return result
  } else if (String(id) === '0x1::coin::transfer') {
    const result = 'Coin Transfer'
    return result
  } else if (String(id).includes('domains::register_domain_with_signature')) {
    const result = 'ANS: Domain Register'
    return result
  } else if (String(id).includes('domains::set_domain_address')) {
    const result = 'ANS: Set Domain Address'
    return result
  } else if (String(id).includes('domains::clear_domain_address')) {
    const result = 'ANS: Clear Domain Address'
    return result
  } else if (String(id) === '0x1::managed_coin::register') {
    const result = 'Coin Register'
    return result
  } else {
    const func = String(id).split('::')
    const result = `${func[1]}::${func[2]}`
    return result
  }
}

export const getAddressFromPayload = (data) => {
  if (data.payload.function === '0x1::coin::transfer') {
    if (String(data.payload.arguments[0]).length > 60) {
      return data.payload.arguments[0]
    } else {
      return data.payload.arguments[0]
    }
  } else if (data.payload.function === '0x1::aptos_account::transfer') {
    if (String(data.payload.arguments[0]).length > 60) {
      return data.payload.arguments[0]
    } else {
      return data.payload.arguments[0]
    }
  } else {
    return getAddressFromFunctionId(data.payload.function)
  }
}

export const calculateFee = (data) => {
  const gasUsed = Number(data.gas_used)
  const gasUnitPrice = Number(data.gas_unit_price)
  const result = new BigNumber(gasUsed).div(new BigNumber(10).pow(8)).multipliedBy(gasUnitPrice).toString()
  return result
}

export const getAPTTransferAmount = (walletAddress, data) => {
  if (data.payload.function === '0x1::aptos_account::transfer') {
    const fromMe = String(data.payload.arguments[0]).toLocaleLowerCase() === String(walletAddress).toLowerCase() ? true : false
    const amount = data.payload.arguments[1]
    if (!fromMe) {
      const result = (
        <Typography className='font-light whitespace-nowrap text-md' color='text-red-500'>
          - {new BigNumber(amount).div(new BigNumber(10).pow(8)).toString()} APT
        </Typography>
      )
      return result
    } else {
      const result = (
        <Typography className='font-light whitespace-nowrap text-md' color='text-green-500'>
          + {new BigNumber(amount).div(new BigNumber(10).pow(8)).toString()} APT
        </Typography>
      )
      return result
    }
  } else if (data.payload.function === '0x1::coin::transfer' && data.payload.type_arguments[0] === '0x1::aptos_coin::AptosCoin') {
    const fromMe = String(data.payload.arguments[0]).toLocaleLowerCase() === String(walletAddress).toLowerCase() ? true : false
    const amount = data.payload.arguments[1]
    if (!fromMe) {
      const result = (
        <Typography className='font-light whitespace-nowrap text-md' color='text-red-500'>
          - {new BigNumber(amount).div(new BigNumber(10).pow(8)).toString()} APT
        </Typography>
      )
      return result
    } else {
      const result = (
        <Typography className='font-light whitespace-nowrap text-md' color='text-green-500'>
          + {new BigNumber(amount).div(new BigNumber(10).pow(8)).toString()} APT
        </Typography>
      )
      return result
    }
  } else {
    const result = <Typography className='font-light whitespace-nowrap text-md'>0 APT</Typography>
    return result
  }
}
