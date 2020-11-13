import { Table } from 'antd'
import moment from 'moment'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const customerBooked = gql`
query customer_booked($cardcode:String,$customer_incoming_id:Int)
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

const IncomingPaymentsBooked = (props) => {
  const { record } = props

  const { loading, data, error } = useQuery(
    customerBooked,
    {
      variables: {
        cardcode: record.cardcode,
        customer_incoming_id: record.customer_incoming_id
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer_booked = get(_data, 'accounting_customer_booked', null)

  const column = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '20%',
      render: (text, render) => text ? moment(text).format('DD-MMM-YY') : '-'
    },
    {
      title: '#',
      dataIndex: 'trip_id',
      width: '20%'
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      width: '20%'
    },
    {
      title: 'Booked For',
      dataIndex: 'comment',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '20%'

    }
  ]

  return (
    <Table
      columns={column}
      dataSource={customer_booked}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
      loading={loading}
    />
  )
}

export default IncomingPaymentsBooked
