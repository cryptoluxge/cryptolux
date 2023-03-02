import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter'
import { RiseWallet } from '@rise-wallet/wallet-adapter'
import { Web3ReactProvider } from '@web3-react/core'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Web3 from 'web3'
import App from './App'
import './index.css'

function getLibrary(provider) {
  return new Web3(provider)
}

const wallets = [new MartianWallet(), new PetraWallet(), new RiseWallet()]

const root = ReactDOM.createRoot(document.getElementById('root'))
window.addEventListener('load', () => {
  root.render(
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
          <App />
        </AptosWalletAdapterProvider>
      </Web3ReactProvider>
    </BrowserRouter>
  )
})
