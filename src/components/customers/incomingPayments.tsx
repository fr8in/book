import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import get from 'lodash/get'
import moment from 'moment'

const INCOMING_PAYMENT = gql`
query customerIncoming($walletcode: String!) {
  customer_sap_incoming( walletcode:$walletcode) {
    walletcode
    date
    wallet_moved_date
    docnum
    docentry
    remarks
    transaction_type
    doc_line
    doc_rate
    received
    booked
    balance
  }
} 
`

const IncomingPayments = (props) => {
  const { walletcode } = props

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { walletcode: walletcode }
    }
  )

  console.log('Incoming Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer_incomings = get(_data, 'customer_sap_incoming', 0)

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '15%',
      render: (text, render) => text ? moment(text).format('DD-MMM-YY') : '-'
    },
    {
      title: 'Amount',
      dataIndex: 'received',
      width: '15%',
      sorter: (a, b) => (a.received > b.received ? 1 : -1)
    },
    {
      title: 'Booked',
      dataIndex: 'booked',
      width: '15%',
      sorter: (a, b) => (a.booked > b.booked ? 1 : -1)
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '15%',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1)
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '40%'
    }
  ]
  return (
    <Table
      columns={columns}
      expandedRowRender={record => <IncomingPaymentsBooked customer_booked={record.customer_incomings} />}
      dataSource={customer_incomings}
      rowKey={record => record.docentry}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      loading={loading}
    />

  )
}
export default IncomingPayments
