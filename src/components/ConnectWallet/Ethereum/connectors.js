import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56, 43114, 137, 250, 25, 42161],
})
