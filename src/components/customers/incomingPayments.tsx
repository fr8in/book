import { Table } from 'antd'

const IncomingPayments = (props) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '10%'
    },
    {
      title: 'Load Id',
      dataIndex: 'loadId',
      width: '10%'
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      width: '10%'
    },
    {
      title: 'Booked For',
      dataIndex: 'comments',
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
      columns={columns}
      dataSource={props.docEntry}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
    />
  )
}

export default IncomingPayments
