import React from 'react'
import Typography from 'components/Typography'
import WithdrawButton from './WithdrawButton'
import { BodyTd, BodyTr, HeadTh, HeadTr, Table, Tbody, Thead } from 'components/Table'

const TableView = ({ data, isChecking }) => {
  return (
    <div>
      <Table>
        <Thead>
          <HeadTr>
            <HeadTh>სახელი</HeadTh>
            <HeadTh>ლეველი</HeadTh>
            <HeadTh>პროგრესი</HeadTh>
            <HeadTh>დასტეიკდა</HeadTh>
            {isChecking === true ? null : <HeadTh></HeadTh>}
          </HeadTr>
        </Thead>
        <Tbody>
          {data.data.map((x, index) => (
            <BodyTr key={index}>
              <BodyTd isLast={index !== data.data.length - 1} rightCorner={index === data.data.length - 1}>
                <div className='flex items-center gap-2'>
                  <img src={`https://bafybeih6hezn7yyabgunclxhi5xa2sbfd6gnnc6un3lilcufq5yyywlpqm.ipfs.nftstorage.link/${String(x.tokens.name).split('#')[1]}.png`} alt={x.tokens.name} className='rounded-full w-[36px] h-[36px] ' />
                  <Typography className='font-light whitespace-nowrap'>{String(x.tokens.name).replace('Bruh Bear', '').replace('#', '')}</Typography>
                </div>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1}>
                <Typography className='font-light'>{x.level}</Typography>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1}>
                <Typography className='font-light'>{x.progress}%</Typography>
              </BodyTd>
              <BodyTd isLast={index !== data.data.length - 1}>
                <Typography className='font-light whitespace-nowrap'>{x.tokens.stakedAt}</Typography>
              </BodyTd>
              {isChecking === true ? null : (
                <BodyTd isLast={index !== data.data.length - 1} leftCorner={index === data.data.length - 1}>
                  <WithdrawButton data={x.tokens} />
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
