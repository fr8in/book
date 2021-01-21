
import { Table, Tooltip, Pagination } from 'antd'
import { useState } from 'react'
import { gql, useSubscription, useQuery } from '@apollo/client'
import get from 'lodash/get'
import Truncate from '../../common/truncate'
import u from '../../../lib/util'
import moment from 'moment'
import LinkComp from '../../common/link'

const ICICIBANK_STATEMENT = gql`
subscription iciciBank_statement($fromDate: timestamp, $toDate: timestamp,$offset:Int,$limit:Int) {
  iciciBank_statement (offset:$offset,limit:$limit, where:{_and:[{txn_date:{_gt:$fromDate}},{txn_date:{_lte:$toDate}}]}){
     id 
     txn_date
     amount
     outgoing_no
     bank_reference_no
     type
     cardcode
     remarks
     balance
     date
   }
 }
 `
const ICICIBANK_STATEMENT_AGGREGATE = gql`
query iciciBank_statement_aggregate($fromDate: timestamp, $toDate: timestamp){
  iciciBank_statement_aggregate(where:{_and:[{txn_date:{_gt:$fromDate}},{txn_date:{_lte:$toDate}}]}){
    aggregate{
      count
    }
  }
}
`
const Last7daysPending = () => {

  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const perviousDate = u.getPervious4thDate()
  const futureDate = u.getfuture3rdDate()

  const { loading, error, data } = useSubscription(
    ICICIBANK_STATEMENT,
    {
      variables: {
        offset: offset,
        limit: u.limit,
        fromDate: moment(perviousDate).format('DD-MMM-YY HH:mm'),
        toDate: moment(futureDate).format('DD-MMM-YY HH:mm')
      }
    }
  )
  console.log('last7daysPending Error', error)
  let _statement = []
  if (!loading) {
    _statement = data
  }
  const statement = get(_statement, 'iciciBank_statement', [])

  const { loading: count_loading, error: count_error, data: count_data } = useQuery(
    ICICIBANK_STATEMENT_AGGREGATE,
    {
      variables: {
        fromDate: moment(perviousDate).format('DD-MMM-YY HH:mm'),
        toDate: moment(futureDate).format('DD-MMM-YY HH:mm')
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  let _statement_count = []
  if (!count_loading) {
    _statement_count = count_data
  }
  const statement_count = get(_statement_count, 'iciciBank_statement_aggregate', [])
  const record_count = get(statement_count, 'aggregate.count', null)

  const onPageChange = (page, pageSize) => {
    const newOffset = page * pageSize - u.limit
    setCurrentPage(page)
    setOffset(newOffset)
  }
  const columns = [
    {
      title: <Tooltip title='Transaction Date'>Tnx Date</Tooltip>,
      dataIndex: 'txn_date',
      render: (text, render) => text ? moment(text).format('DD-MMM-YY HH:mm:ss') : '-',
      sorter: (a, b) => (a.txn_date > b.txn_date ? 1 : -1),
      defaultSortOrder: 'descend',
      width: '12%',
    },
    {
      title: 'Cardcode',
      dataIndex: 'cardcode',
      render: (text, record) => {
        return (
          <LinkComp type='partners' data={text} id={text} />
        )
      },
      sorter: (a, b) => (a.cardcode > b.cardcode ? -1 : 1),
      width: '10%',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => (a.amount > b.amount ? -1 : 1),
      width: '5%',
    },
    {
      title: 'Outgoing No',
      dataIndex: 'outgoing_no',
      sorter: (a, b) => (a.outgoing_no > b.outgoing_no ? -1 : 1),
      width: '10%',
    },
    {
      title: <Tooltip title='Bank Reference No'>Ref No</Tooltip>,
      dataIndex: 'bank_reference_no',
      sorter: (a, b) => (a.bank_reference_no > b.bank_reference_no ? -1 : 1),
      width: '10%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => (a.type > b.type ? -1 : 1),
      width: '7%',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      render: (text, record) => {
        const remarks = get(record, 'remarks', null)
        return (<Truncate data={remarks} length={90} />)
      },
      width: '46%',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => (a.balance > b.balance ? -1 : 1),
      width: '10%',
    }
  ]

  return (
    <>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={statement}
        size='small'
        scroll={{ x: 1250 }}
        pagination={false}
        loading={loading}
      />
      {!loading && record_count &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={u.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={onPageChange}
          className='text-right p10'
        />}
    </>
  )
}

export default Last7daysPending

