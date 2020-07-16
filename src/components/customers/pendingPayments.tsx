import React from 'react'
import { Table } from 'antd'

const PendingPayments = () => {
  const pendingPayments = [
    {
      title: 'Pending Payments',
      dataIndex: 'pendingPayments'
    },
    {
      title: 'Advance',
      dataIndex: 'advance'
    },
    {
      title: 'Invoice Pending',
      dataIndex: 'invoicePending'
    },
    {
      title: 'Invoiced',
      dataIndex: 'invoiced'
    }
  ]

  return (
    <Table
      columns={pendingPayments}
      rowKey={(record) => record.id}
      size='small'
      pagination={false}
      scroll={{ x: 400 }}
    />
  )
}

export default PendingPayments
