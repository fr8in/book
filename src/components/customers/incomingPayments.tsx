import { Table } from 'antd'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import get from 'lodash/get'
import moment from 'moment'

const INCOMING_PAYMENT = gql`
query customer_booked_incoming($cardcode:String){
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

const IncomingPayments = (props) => {
  const { cardcode } = props

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { cardcode: cardcode },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )



  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer[0]', [])
  const customer_incomings = get(customer, 'customer_incoming', 0)

  const columns = [
    {
      title: 'Date',
      dataIndex: 'wallet_moved_date',
      width: '15%',
      render: (text, render) => text ? moment(text).format('DD-MMM-YY') : '-',
      sorter: (a, b) => (a.wallet_moved_date > b.wallet_moved_date ? 1 : -1)
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
      expandedRowRender={record => <IncomingPaymentsBooked record={record} />}
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
