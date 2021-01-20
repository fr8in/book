
import { Table, Tooltip, Pagination } from 'antd'
import { useState } from 'react'
import { gql, useSubscription, useQuery } from '@apollo/client'
import get from 'lodash/get'
import Truncate from '../../common/truncate'
import u from '../../../lib/util'

const ICICIBANK_STATEMENT = gql`
subscription iciciBank_statement($offset:Int,$limit:Int){
  iciciBank_statement (offset:$offset,limit:$limit){
     id
     txn_date
     amount
     outgoing_no
     bank_reference_no
     type
     remarks
     balance
     date
   }
 }`
const ICICIBANK_STATEMENT_AGGREGATE = gql`
query iciciBank_statement_aggregate{
  iciciBank_statement_aggregate{
    aggregate{
      count
    }
  }
}
`
const Last7daysPending = (props) => {

  const [offset,setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { loading, error, data } = useSubscription(
    ICICIBANK_STATEMENT,
    {
      variables:{
        offset:offset,
        limit:u.limit
      }
    }
    )

  let _statement = []
  if (!loading) {
    _statement = data
  }
  const statement = get(_statement, 'iciciBank_statement', [])

  const { loading: count_loading, error: count_error, data: count_data } = useQuery(
    ICICIBANK_STATEMENT_AGGREGATE,
    {
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
      sorter: (a, b) => (a.txn_date > b.txn_date ? -1 : 1),
      defaultSortOrder: 'descend',
      width: '10%',
    },
    {
      title: 'Cardcode',
      dataIndex: 'cardcode',
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
      width: '48%',
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
        scroll={{ x: 1156 }}
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

