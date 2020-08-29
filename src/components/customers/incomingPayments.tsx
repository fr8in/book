import IncomingPaymentData from '../../../mock/customer/incomingdata'
import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import get from 'lodash/get'


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

  const {cardcode} = props

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { cardcode: cardcode }
    }
    
  )

  console.log('Incoming Error', error)
 
  var _data = {}
  if (!loading) {
    _data = data
  }

  console.log('_data',_data)

  const customer = get(_data, 'customer', [])
  const customer_incomings = get(_data, 'customer[0].customer_incomings', 0)
 

console.log('customer',customer_incomings)


  const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'recevied',
      key: 'recevied',
      width: '20%'
    },
    {
      title: 'Booked',
      dataIndex: 'booked',
      key: 'booked',
      width: '20%',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: '20%',
    },
    {
      title: 'Remarks',
      dataIndex: 'comment',
      key: 'comment',
      width: '20%',
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
    />

  )
}
export default IncomingPayments
