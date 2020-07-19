import { Table } from 'antd'

const IncomingPaymentsLead = (props) => {
  const data = [
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
      columns={data}
      dataSource={props.lead}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
    />
  )
}

export default IncomingPaymentsLead
