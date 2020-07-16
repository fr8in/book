import { Table } from 'antd'

const IncomingPayments = () => {
  const incomingPayments = [
    {
      title: 'Date',
      dataIndex: 'date'
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Booked',
      dataIndex: 'booked'
    },
    {
      title: 'Balance',
      dataIndex: 'balance'
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks'
    }
  ]

  return (
    <Table
      columns={incomingPayments}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default IncomingPayments
