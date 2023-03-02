import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'
import { getChainFullName } from 'utils/WalletHelpers'

import Arbitrum from 'assets/images/Blockchains/Arbitrum.svg'
import AVAX from 'assets/images/Blockchains/Avalanche.svg'
import BSC from 'assets/images/Blockchains/Binance.svg'
import Cronos from 'assets/images/Blockchains/Cronos.svg'
import ETH from 'assets/images/Blockchains/Ethereum.svg'
import Fantom from 'assets/images/Blockchains/Fantom.svg'
import Polygon from 'assets/images/Blockchains/Matic.svg'

import { useWeb3React } from '@web3-react/core'
import { ArbitrumChain, AvalancheChain, BNBChain, CronosChain, ETHChain, FantomChain, PolygonChain } from 'utils/EVMNetworks'
import ItemList from './ItemList'

const ChainSelector = () => {
  const { active, chainId } = useWeb3React()
  return (
    <div>
      {active && (
        <Menu as='div' className='inline-block text-left'>
          <Menu.Button className='p-2.5 w-full rounded-md bg-lightCard font-medium text-white duration-150 border-[1px] border-lightBorder'>
            <div className='flex items-center justify-between gap-3'>
              <div>{getChainFullName(chainId)}</div>
              <ChevronDownIcon className='h-5 w-5' aria-hidden='true' />
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'>
            <Menu.Items className='origin-top-center absolute center-1 mt-2 w-40 rounded-md shadow-lg z-50 bg-lightModal focus:outline-none border-[1px] border-lightBorder'>
              <ul className=''>
                <li onClick={() => BNBChain()}>
                  <ItemList name='Smart Chain' logo={BSC} logoWidth='w-4' color='primary' isFirst={true} />
                </li>
                <li onClick={() => ETHChain()}>
                  <ItemList name='Ethereum' logo={ETH} logoWidth='w-3' color='primary' />
                </li>
                <li onClick={() => AvalancheChain()}>
                  <ItemList name='Avalanche' logo={AVAX} logoWidth='w-4' color='primary' />
                </li>
                <li onClick={() => PolygonChain()}>
                  <ItemList name='Polygon' logo={Polygon} logoWidth='w-4' color='primary' />
                </li>
                <li onClick={() => FantomChain()}>
                  <ItemList name='Fantom' logo={Fantom} logoWidth='w-3' color='primary' />
                </li>
                <li onClick={() => CronosChain()}>
                  <ItemList name='Cronos' logo={Cronos} logoWidth='w-4' color='primary' />
                </li>
                <li onClick={() => ArbitrumChain()}>
                  <ItemList name='Arbitrum' logo={Arbitrum} logoWidth='w-4' color='primary' isLast={true} />
                </li>
              </ul>
            </Menu.Items>
          </Transition>
        </Menu>
      )}

    </div>
  )
}

export default ChainSelector
