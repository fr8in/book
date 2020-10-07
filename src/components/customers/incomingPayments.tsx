import { Table } from 'antd'
import { gql, useQuery,useLazyQuery } from '@apollo/client'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import get from 'lodash/get'
import moment from 'moment'

const INCOMING_PAYMENT = gql`
query customerIncoming($cardcode:String){
  customer(where:{cardcode:{_eq:$cardcode}}){
    cardcode
    id
    customer_incoming{
      cardcode
      wallet_moved_date
      comment
      customer_incoming_id
      recevied
      booked
      balance
    }
   }
}`

const customerBooked = gql`
query customerbooked($cardcode:String,$customer_incoming_id:Int)
{
  accounting_customer_booked(where:{cardcode:{_eq:$cardcode} ,customer_incoming_id:{_eq:$customer_incoming_id}})
  {
    amount
    id
    trip_id
    invoice_no
    customer_incoming_id
    comment
    created_at
  }
}`


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
  const customer_incomings = get(customer, 'customer_incoming', 0)

  const [getCustomerBooked,{ loading: cus_loading, data: cus_data, error: cus_error }] = useLazyQuery(customerBooked)
    
    let _cus_data = {}
    if (!cus_loading) {
      _cus_data = cus_data
    }
  const customer_booked = get(_cus_data, 'accounting_customer_booked', null)

  const onExpand = (_, record) => {
    console.log('onExpand', record)
    getCustomerBooked({
      variables: {cardcode: record.cardcode,customer_incoming_id:record.customer_incoming_id}
    })
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'wallet_moved_date',
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
      expandedRowRender={record => <IncomingPaymentsBooked  customer_booked={customer_booked}/>}
      onExpand={onExpand}
      dataSource={customer_incomings}
      rowKey={record => record.customer_incoming_id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      loading={loading}
    />

  )
}
export default IncomingPayments
