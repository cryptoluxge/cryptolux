import { useWeb3React } from '@web3-react/core'
import Alert from 'components/Alerts'
import Button from 'components/Button'
import Card from 'components/Cards/Card'
import AddressComponent from 'components/CryptoComponents/AddressComponent'
import Input from 'components/Input'
import { Option, Select } from 'components/Select'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import { supportedEVMChains } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'
import { getTokenApprovals } from 'utils/APIs/MoralisAPI'
import { getTokenContract } from 'utils/Helpers/BlockchainHelpers'
import { getChainDataById } from 'utils/WalletHelpers'

const Index = () => {
  const { account, chainId, active } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const [chainName, setChainName] = useState('')
  const [data, setData] = useState([])
  const toast = useToast()

  const checkAccount = async () => {
    setData([])
    setChainName('')
    setIsLoading(false)
    const getWalletAddress = document.getElementById('walletAddress').value
    const getChain = document.getElementById('addressChain').value
    if (getChain !== 'selectChain') {
      if (getWalletAddress !== '') {
        setIsLoading(true)
        const getApprovals = await getTokenApprovals(getWalletAddress, getChain)
        setData(getApprovals)
        supportedEVMChains.forEach((x) => {
          if (x.moralisId === getChain) {
            setChainName(x.networkName)
          }
        })
      } else {
        toast('error', 'შეიყვანეთ საფულის მისამართი!')
      }
    } else {
      toast('error', 'აირჩიეთ ქსელი!')
    }
    setIsLoading(false)
  }

  const unRekt = async (unrektData) => {
    const contract = getTokenContract(unrektData.data.contract_address, chainName, true)
    await contract.methods
      .approve(unrektData.data.to_wallet, 0)
      .send({ from: account })
      .once('transactionHash', (hash) => {
        toast('loading', 'ტრანზაქცია მუშავდება', '', hash)
      })
      .on('error', (error) => {
        if (error.code === 4001) {
          toast('error', 'Transaction rejected by user', 'თქვენ ტრანზაქცია არ დაადასტურეთ')
        } else if (error.code === -32003) {
          toast('error', 'Transaction rejected', 'თქვენი ტრანზაქცია არ დადასტურდა.')
        } else if (error.code === -32603) {
          toast('error', 'intrinsic gas too low', 'საკომისიო ძალიან დაბალია.')
        } else {
          toast('error', 'თქვენი ტრანზაქცია არ დადასტურდა!')
        }
      })
      .then((receipt) => {
        if (receipt.status === true) {
          toast('success', 'ტრანზაქცია დადასტურდა!', '', receipt.transactionHash)
        } else {
          toast('error', 'ტრანზაქცია არ დადასტურდა!', '', receipt.transactionHash)
        }
      })
  }

  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='w-full lg:w-[550px] xl:w-[600px]'>
          <Card title='საფულის შემოწმება' titleBorder={true}>
            <div className='p-2'>
              <div className='mb-2 bg-darkBackground p-1 rounded-md border-[1px] border-lightBorder'>
                <Typography color='text-gray-500 text-sm'>შეამოწმეთ საფულის დააპროვებული ტოკენები სხვადასხვა EVM ქსელებზე.</Typography>
              </div>
              <Select id='addressChain' defaultValue='აირჩიეთ ქსელი'>
                <Option value='selectChain'>აირჩიეთ ქსელი</Option>
                {supportedEVMChains.map((x) => (
                  <Option key={x.networkName} value={x.moralisId}>
                    {x.networkName}
                  </Option>
                ))}
              </Select>
              <div className='flex flex-col md:flex-row md:items-center gap-2 w-full mt-2'>
                <div className='flex items-center gap-2 w-full'>
                  <Input onKeyDown={(e) => e.key === 'Enter' && checkAccount()} id='walletAddress' placeholder='შეიყვანეთ საფულის მისამართ ან მისამართები' />
                </div>
                <Button onClick={() => checkAccount()} loading={isLoading}>
                  შეამოწმე
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className='mt-2'>
        {Object.keys(data).length > 0 && (
          <Card title='Token Approvals' titleBorder={true}>
            <div>
              {data.status === 200 ? (
                <div>
                  {Object.keys(data.data).length > 0 ? (
                    <Table>
                      <Thead>
                        <HeadTr>
                          <HeadTh>Tx ჰეში</HeadTh>
                          <HeadTh>თარიღი</HeadTh>
                          <HeadTh>ბლოკი</HeadTh>
                          <HeadTh>ტოკენი</HeadTh>
                          <HeadTh>Approved მისამართი</HeadTh>
                          <HeadTh>Approved რაოდენობა</HeadTh>
                          {active && <HeadTh></HeadTh>}
                        </HeadTr>
                      </Thead>
                      <Tbody>
                        {data.data.map((x, index) => (
                          <BodyTr key={index}>
                            <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                              <AddressComponent address={x.data.transaction_hash} type='tx' chainId={data.chainId} />
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                              <Typography className='whitespace-nowrap'>{String(x.data.block_timestamp).replace('T', ' ').replace('Z', '').replace('.000', '')}</Typography>
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.length - 1}>
                              <AddressComponent short={true} address={x.data.block_number} type='block' chainId={data.chainId} />
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.length - 1}>
                              <Typography>
                                {x.tokenData.name} ({String(x.tokenData.symbol).toUpperCase()})
                              </Typography>
                              <AddressComponent address={x.data.contract_address} type='wallet' chainId={data.chainId} />
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.length - 1}>
                              <AddressComponent address={x.data.to_wallet} type='wallet' chainId={data.chainId} />
                            </BodyTd>
                            <BodyTd isLast={index !== data.data.length - 1}>
                              <Typography>{Number(x.data.value) > 115792089237316195 ? 'Unlimited' : x.tokenData.decimals !== 0 ? x.data.value / 10 ** x.tokenData.decimals : x.data.value}</Typography>
                            </BodyTd>
                            {active ? (
                              <BodyTd isLast={index !== data.data.length - 1} leftCorner={index === data.data.length - 1}>
                                {chainId === data.chainId ? <Button onClick={() => unRekt(x)}>UNREKT</Button> : <Typography>გადართეთ {getChainDataById(data.chainId).symbol} ქსელზე</Typography>}
                              </BodyTd>
                            ) : null}
                          </BodyTr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <div className='p-2'>
                      <Alert variant='info' text={`დააპროვებული ტოკენები/კონტრაქტები ${String(chainName).toUpperCase()} ქსელზე არ გაქვთ!`} />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Alert variant='error' text='API კავშირი ვერ მოხერხდა! ცადეთ მოგვიანებით.' />
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Index
