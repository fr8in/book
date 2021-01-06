
import { Table} from 'antd'
import React from 'react'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const ICICI_TRANSACTION= gql` query ICICI ($start_date:String!,$end_date:String!){
  icici_transaction(start_date:$start_date,end_date:$end_date){
    result{
      date
      amount
      chequeNo
      txnDate
      remarks
      transactionId
      type
      balance
    }
  }
}`

const Last48hrsPending = (props) => {
  const {start_date,date} = props
console.log('Last48',date)
  console.log('///.....',start_date)
  const fromdate =  !start_date[0] ? date[0].format('DD-MM-YYYY') : start_date[0].format('DD-MM-YYYY')
  console.log('fromdate',fromdate)
  const todate = !start_date[1] ? date[1].format('DD-MM-YYYY'): start_date[1].format('DD-MM-YYYY')
 console.log('todate', todate)
  const { loading, error, data} = useQuery(
    ICICI_TRANSACTION, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
     skip : !fromdate || !todate,
      variables:{
        start_date:fromdate ,
        end_date:todate
      }
    }
  )
  
  console.log('pendingTransaction error', error)

  let _data = []
  if (!loading) {
    _data = data
  }

  const icici_transaction = get(_data, 'icici_transaction.result', [])
 console.log(icici_transaction)

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
      defaultSortOrder: 'desc',
      width: '10%',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      width: '10%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => (a.type > b.type ? 1 : -1),
      width: '10%',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      width: '20%',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '10%',
    },
    {
      title: 'TransactionId',
      dataIndex: 'transactionId',
      width: '15%',
    },
    {
      title: 'TxnDate',
      dataIndex: 'txnDate',
      width: '10%',
    },
    {
      title: 'ChequeNo',
      dataIndex: 'chequeNo',
      width: '15%',
    }      
     
  ]

  return (
      <Table
        rowKey={(record => record.transactionId)}
        columns={columns}
        dataSource={icici_transaction}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
      />)
}

export default Last48hrsPending

