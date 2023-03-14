import { InjectedConnector } from '@web3-react/injected-connector'
import { supportedEvmChainsIDs } from 'config'

export const injected = new InjectedConnector({
  supportedChainIds: supportedEvmChainsIDs,
})
