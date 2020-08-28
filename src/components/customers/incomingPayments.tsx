import IncomingPaymentData from '../../../mock/customer/incomingdata'
import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import ColumnGroup from 'antd/lib/table/ColumnGroup'


const INCOMING_PAYMENT = gql`
query customer_booking($cardcode: String) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    customer_accounting {
      wallet_balance
    }
    customer_incomings {
      booked
      balance
      comment
      recevied
      customer_booked {
        amount
        comment
      }
    }
  }
}           
`

const IncomingPayments = (props) => {

  const {cardcode} = props

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    cardcode
  )

  console.log('Excess Load Error', error)
  var customer = []

  if (!loading) {
    customer = data && data.customer
  }
 
console.log('customer',customer)


  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%'
    },
    {
      title: 'Booked',
      dataIndex: 'booked',
      key: 'booked',
      width: '20%',
      render: (text, record) => {
        return record.customer && record.customer_info.customer_incomings && record.customer_info.customer_incomings.booked
      }
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: '20%',
      render: (text, record) => {
        return record.customer_info && record.customer_info.customer_incomings && record.customer_info.customer_incomings.balance
      }
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '20%',
      render: (text, record) => {
        return record.customer_info && record.customer_info.customer_incomings && record.customer_info.customer_incomings.comment
      }
    }
  ]
  return (
    <Table
      columns={columns}
      expandedRowRender={record => <IncomingPaymentsBooked {...record} />}
      dataSource={data}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />

  )
}
export default IncomingPayments
