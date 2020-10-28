import { Table, Modal } from 'antd'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'

const INCOMING_PAYMENT = gql`
query customer_booked_incoming($cardcode:String){
  customer(where:{cardcode:{_eq:$cardcode}}){
    cardcode
    id
    customer_incoming(where:{balance:{_neq:0}}){
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

const BookedDetail = (props) => {
  const { visible, onHide, cardcode } = props

  const { loading, data, error } = useQuery(
    INCOMING_PAYMENT,
    {
      variables: { cardcode: cardcode },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('Incoming Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer[0]', [])
  const customer_incomings = get(customer, 'customer_incoming', 0)

  const columns = [{
    title: 'Date',
    dataIndex: 'wallet_moved_date',
    width: '14%',
    render: (text, render) => text ? moment(text).format('DD-MMM-YY') : '-',
    sorter: (a, b) => (a.wallet_moved_date > b.wallet_moved_date ? 1 : -1)
  },
  {
    title: 'Amount',
    dataIndex: 'recevied',
    width: '12%',
    sorter: (a, b) => (a.recevied > b.recevied ? 1 : -1)
  },
  {
    title: 'Booked',
    dataIndex: 'booked',
    width: '12%',
    sorter: (a, b) => (a.booked > b.booked ? 1 : -1)
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '12%',
    sorter: (a, b) => (a.balance > b.balance ? 1 : -1)
  },
  {
    title: 'Remarks',
    dataIndex: 'comment',
    width: '50%',
    render: (text, record) => <Truncate data={text} length={40} />
  }]

  return (
    <Modal
      title='Booked Amount'
      visible={visible}
      onCancel={onHide}
      width={800}
      bodyStyle={{ padding: 5 }}
    >
      <Table
        columns={columns}
        dataSource={customer_incomings}
        rowKey={(record) => record.customer_incoming_id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
        expandedRowRender={record => <IncomingPaymentsBooked record={record} />}
        loading={loading}
      />
    </Modal>
  )
}

export default BookedDetail
