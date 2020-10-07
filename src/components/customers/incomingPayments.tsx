import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import get from 'lodash/get'
import moment from 'moment'

const INCOMING_PAYMENT = gql`
query customer_booking($cardcode: String) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    customer_incomings {
      id
      booked
      balance
      comment
      recevied
      created_at
      customer_booked {
        id
        created_at
        amount
        comment
        trip_id
        invoice_no
      }
    }
  }
}     
`

const IncomingPayments = (props) => {
  const { cardcode } = props

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { cardcode: cardcode }
    }
  )

  console.log('Incoming Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer[0]', [])
  const customer_incomings = get(_data, 'customer_sap_incoming', 0)

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      width: '15%',
      render: (text, render) => text ? moment(text).format('DD-MMM-YY') : '-'
    },
    {
      title: 'Amount',
      dataIndex: 'recevied',
      width: '15%',
      sorter: (a, b) => (a.recevied > b.recevied ? 1 : -1)
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
      dataIndex: 'comment',
      key: 'comment',
      width: '40%'
    }
  ]
  return (
    <Table
      columns={columns}
      expandedRowRender={record => <IncomingPaymentsBooked customer_booked={record.customer_booked} />}
      dataSource={customer_incomings}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      loading={loading}
    />

  )
}
export default IncomingPayments
