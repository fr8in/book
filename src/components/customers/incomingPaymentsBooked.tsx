import { Table } from 'antd'

const IncomingPaymentsBooked = (props) => {
  const data = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '10%'
    },
    {
      title: 'Load Id',
      dataIndex: 'id',
      width: '10%'
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      width: '10%'
    },
    {
      title: 'Booked For',
      dataIndex: 'bookedFor',
      width: '10%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    }

  ]

  return (
    <Table
      columns={data}
      dataSource={props.lead}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
    />
  )
}

export default IncomingPaymentsBooked
