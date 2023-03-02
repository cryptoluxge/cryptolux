import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import moment from 'moment'
import WithdrawButton from './WithdrawButton'

const TableView = ({ data, isChecking }) => {
  
  const calculateStakedTime = (timestamp) => {
    const currentDate = moment()
    const stakedTime = moment(timestamp / 1000)
    var a = moment(String(currentDate.toString()))
    var b = moment(String(stakedTime.toString()))
    return a.diff(b, 'hours')
  }

  return (
    <div>
      <Table>
        <Thead>
          <HeadTr>
            <HeadTh>სახელი</HeadTh>
            <HeadTh>დაგროვებული</HeadTh>
            <HeadTh>სტეიკის დრო</HeadTh>
            <HeadTh>სტეიკის დასტეიკდა</HeadTh>
            {isChecking === true ? null : <HeadTh></HeadTh>}
          </HeadTr>
        </Thead>
        <Tbody>
          {data.data.map((x, index) => (
            <BodyTr key={index} >
              <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                <div className='flex items-center gap-2'>
                  <img
                    src={`https://ipfs.io/ipfs/bafybeig6bepf5ci5fyysxlfefpjzwkfp7sarj6ed2f5a34kowgc6qenjfa/${String(x.token_id.token_data_id.name).split('#')[1]}.png`}
                    alt={x.token_id.token_data_id.name}
                    className='rounded-full w-[36px] h-[36px] '
                  />
                  <Typography className='font-light whitespace-nowrap'>{String(x.token_id.token_data_id.name).replace('AptosMonkeys', '').replace('#', '')}</Typography>
                </div>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{Number(calculateStakedTime(x.start_time) * 0.04).toFixed(2)} SEEDZ</Typography>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{calculateStakedTime(x.start_time)}სთ</Typography>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{moment(x.start_time / 1000).format('DD/MM/YYYY HH:mm')}</Typography>
              </BodyTd>
              {isChecking === true ? null : (
                <BodyTd isLast={index !== data.data.length - 1} leftCorner={index === data.data.length - 1}>
                  <WithdrawButton data={x} />
                </BodyTd>
              )}
            </BodyTr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}

export default TableView
