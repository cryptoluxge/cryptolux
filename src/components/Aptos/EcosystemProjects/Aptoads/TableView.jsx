import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'
import Typography from 'components/Typography'
import moment from 'moment'
import WithdrawButton from './WithdrawButton'

const TableView = ({ data, isChecking }) => {
  const calculateStakedTime = (timestamp) => {
    const currentDate = moment()
    const stakedTime = moment(timestamp * 1000)
    var a = moment(String(currentDate.toString()))
    var b = moment(String(stakedTime.toString()))
    return a.diff(b, 'days')
  }

  const calculatePendingToken = (timestamp) => {
    const result = Number(calculateStakedTime(timestamp)) * 100
    return Number(result).toLocaleString('en-US')
  }

  return (
    <div>
      <Table>
        <Thead>
          <HeadTr>
            <HeadTh>სახელი</HeadTh>
            <HeadTh>დაგროვებული</HeadTh>
            <HeadTh>დასტეიკებულია</HeadTh>
            <HeadTh>დასტეიკდა</HeadTh>
            {isChecking === true ? null : <HeadTh></HeadTh>}
          </HeadTr>
        </Thead>
        <Tbody>
          {data.map((x, index) => (
            <BodyTr key={index}>
              <BodyTd isLast={index !== data.length - 1} rightCorner={index === data.length - 1}>
                <div className='flex items-center gap-2'>
                  <img src={`https://aptoads.nyc3.digitaloceanspaces.com/mainnet/${String(x.token.id.token_data_id.name).split('#')[1]}.png`} alt={x.token.id.token_data_id.name} className='rounded-full w-[36px] h-[36px] ' />
                  <Typography className='font-light whitespace-nowrap'>{x.token.id.token_data_id.name}</Typography>
                </div>
              </BodyTd>
              <BodyTd isLast={index !== data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{calculatePendingToken(Number(x.token_stake_data.initial_lockup_timestamp))} FLY</Typography>
              </BodyTd>
              <BodyTd isLast={index !== data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{calculateStakedTime(Number(x.token_stake_data.initial_lockup_timestamp))} დღე</Typography>
              </BodyTd>
              <BodyTd isLast={index !== data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{moment(Number(x.token_stake_data.initial_lockup_timestamp) * 1000).format('DD/MM/YYYY HH:mm')}</Typography>
              </BodyTd>
              {isChecking === true ? null : (
                <BodyTd isLast={index !== data.length - 1} leftCorner={index === data.length - 1}>
                  <WithdrawButton
                    data={x.token.id.token_data_id.name}
                    earnedFly={calculatePendingToken(Number(x.token_stake_data.initial_lockup_timestamp))}
                    daysStaked={calculateStakedTime(Number(x.token_stake_data.initial_lockup_timestamp))}
                    stakedAt={moment(Number(x.token_stake_data.initial_lockup_timestamp) * 1000).format('DD/MM/YYYY HH:mm')}
                  />
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
