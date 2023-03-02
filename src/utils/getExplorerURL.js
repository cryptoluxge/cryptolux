const evmExplorerURLS = {
  56: 'https://bscscan.com',
  1: 'https://etherscan.io',
  43114: 'https://snowtrace.io',
  137: 'https://polygonscan.com',
  250: 'https://ftmscan.com',
  25: 'https://cronoscan.com',
  42161: 'https://arbiscan.io'
}

const l1ExplorerURLS = {
  APT: 'https://explorer.aptoslabs.com',
  ADA: 'https://cardanoscan.io',
  MINA: 'https://minascan.io',
}

export const getExplorerURL = (chain, chainId, type, data) => {
  if (chain === 'evm') {
    switch (type) {
      case 'wallet':
        return `${evmExplorerURLS[chainId]}/address/${data}`
      case 'tx':
        return `${evmExplorerURLS[chainId]}/tx/${data}`
      case 'token':
        return `${evmExplorerURLS[chainId]}/token/${data}`
      case 'block':
        return `${evmExplorerURLS[chainId]}/block/${data}`
      default:
        return `${evmExplorerURLS[chainId]}/`
    }
  } else {
    if (chain === 'APT') {
      switch (type) {
        case 'wallet':
          return `${l1ExplorerURLS[chain]}/account/${data}`
        case 'tx':
          return `${l1ExplorerURLS[chain]}/txn/${data}`
        default:
          return `${l1ExplorerURLS[chain]}/`
      }
    } else if (chain === 'ADA') {
      switch (type) {
        case 'wallet':
          return `${l1ExplorerURLS[chain]}/address/${data}`
        case 'tx':
          return `${l1ExplorerURLS[chain]}/transaction/${data}`
        case 'block':
          return `${l1ExplorerURLS[chain]}/block/${data}`
        case 'pool':
          return `${l1ExplorerURLS[chain]}/pool/${data}`
        case 'epoch':
          return `${l1ExplorerURLS[chain]}/epoch/${data}`
        default:
          return `${l1ExplorerURLS[chain]}/`
      }
    } else if (chain === 'MINA') {
      switch (type) {
        case 'wallet':
          return `${l1ExplorerURLS[chain]}/mainnet/account/${data}`
        case 'tx':
          return `${l1ExplorerURLS[chain]}/mainnet/transaction/${data}`
        case 'block':
          return `${l1ExplorerURLS[chain]}/mainnet/block/${data}`
        case 'pool':
          return `${l1ExplorerURLS[chain]}/mainnet/validator/${data}`
        default:
          return `${l1ExplorerURLS[chain]}/`
      }
    }
  }
}