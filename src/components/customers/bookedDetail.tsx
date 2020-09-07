import { Table, Modal } from 'antd'
import IncomingPaymentsBooked from './incomingPaymentsBooked'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'

const INCOMING_PAYMENT = gql`
query customer_booking($cardcode: String) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    cardcode
    customer_incomings(where: {balance: {_neq: 0}})  {
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

const BookedDetail = (props) => {
  const { visible, onHide, cardcode } = props

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
  const customer_incomings = get(customer, 'customer_incomings', 0)

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const columns = [{
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '15%',
    render: (text, render) => text ? moment(text).format('DD-MMM-YY') : '-'
  },
  {
    title: 'Amount',
    dataIndex: 'recevied',
    key: 'recevied',
    width: '10%'
  },
  {
    title: 'Booked',
    dataIndex: 'booked',
    key: 'booked',
    width: '10%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    width: '10%'
  },
  {
    title: 'Remarks',
    dataIndex: 'comment',
    key: 'comment',
    width: '60%'
  }]

  return (
    <Modal
      title='Booked Amount'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={800}
      bodyStyle={{ padding: 5 }}
    >
      <Table
        columns={columns}
        dataSource={customer_incomings}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
        expandedRowRender={record => <IncomingPaymentsBooked customer_booked={record.customer_booked} />}
      />
    </Modal>
  )
}

export default BookedDetail
