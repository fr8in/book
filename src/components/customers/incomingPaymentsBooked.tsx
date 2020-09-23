import { Table } from 'antd'
import moment from 'moment'

const IncomingPaymentsBooked = (props) => {
  const { customer_booked } = props

  const data = [
    {
      title: 'Date',
      dataIndex: 'created_at',
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
      columns={data}
      dataSource={customer_booked}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
    />
  )
}

export default IncomingPaymentsBooked
