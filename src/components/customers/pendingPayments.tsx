
import { Table } from 'antd'
import pending from '../../../mock/customer/pendingPayments'

const PendingPayments = () => {
  const pendingPayments = [
    {
      title: 'Pending Payments',
      dataIndex: 'pendingPayments',
      width: '35%'
    },
    {
      title: 'Advance',
      dataIndex: 'advance',
      width: '25%'
    },
    {
      title: 'Invoice Pending',
      dataIndex: 'invoicePending',
      width: '25%'
    },
    {
      title: 'Invoiced',
      dataIndex: 'invoiced',
      width: '15%'
    }
  ]

  return (
    <Table
      columns={pendingPayments}
      dataSource={pending}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
      scroll={{ x: 400 }}
    />
  )
}

export default PendingPayments
