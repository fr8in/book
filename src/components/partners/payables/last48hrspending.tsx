
import { Table} from 'antd'
import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
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
  const {start_date} = props

  

  const fromdate =  start_date[0] ? start_date[0].format('DD-MM-YYYY') : "" 
  const todate = start_date[1] ? start_date[1].format('DD-MM-YYYY'): ""
 
  const { loading, error, data, refetch } = useQuery(
    ICICI_TRANSACTION, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
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
 
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date'
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'ChequeNo',
      dataIndex: 'chequeNo'
    },
    {
      title: 'TxnDate',
      dataIndex: 'txnDate'
    },
    {
        title: 'Remarks',
        dataIndex: 'remarks'
      },
      {
        title: 'TransactionId',
        dataIndex: 'transactionId'
      },
      {
        title: 'Type',
        dataIndex: 'type'
      },
      {
        title: 'Balance',
        dataIndex: 'balance'
      }
  ]

  return (
      <Table
        columns={columns}
        dataSource={icici_transaction}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />)
}

export default Last48hrsPending
