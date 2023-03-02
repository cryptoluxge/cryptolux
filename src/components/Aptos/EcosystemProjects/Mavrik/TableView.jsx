import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import WithdrawButton from './WithdrawButton'

const TableView = ({ data, isChecking }) => {
  return (
    <div>
      <Table>
        <Thead>
          <HeadTr>
            <HeadTh>სახელი</HeadTh>
            {isChecking === true ? null : <HeadTh></HeadTh>}
          </HeadTr>
        </Thead>
        <Tbody>
          {data.data.map((x, index) => (
            <BodyTr key={index}>
              <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                <div className='flex items-center gap-2'>
                  <img src={`https://gateway.pinata.cloud/ipfs/bafybeic4w3xslhgvojvlkllkcurlzrny34xcpixmreqqe355jxfpbwdura/${Number(String(x).split('#')[1]) - 1}.png`} alt={x} className='rounded-full w-[36px] h-[36px] ' />
                  <Typography className='font-light whitespace-nowrap'>{x}</Typography>
                </div>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1} leftCorner={index === data.data.length - 1}>
                <WithdrawButton data={data.stakedData[index]} />
              </BodyTd>
            </BodyTr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}

export default TableView
