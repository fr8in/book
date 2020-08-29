import { Table } from 'antd'

const IncomingPaymentsBooked = (props) => {

  const {customer_booked} = props

  console.log('props',props)
  

  const data = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      width: '10%'
    },
    {
      title: 'Load Id',
      dataIndex: 'trip_id',
      width: '10%'
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      width: '10%'
    },
    {
      title: 'Booked For',
      dataIndex: 'comment',
      width: '10%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%',
     
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
