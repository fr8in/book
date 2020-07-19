import React from 'react'
import { Table } from 'antd'
import finalPayment from '../../../mock/customer/finalPayment'

const InvoicePending = () => {
  const invoicePending = [
    {
      title: 'Load Id',
      dataIndex: 'loadId',
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Source',
      dataIndex: 'source',
      width: '10%'
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      width: '10%'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      width: '10%'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '10%'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      width: '15%'
    },
    {
      title: 'SO Price',
      dataIndex: 'soPrice',
      sorter: (a, b) => (a.soPrice > b.soPrice ? 1 : -1),
      width: '15%'
    },
    {
      title: 'Received',
      dataIndex: 'received',
      sorter: (a, b) => (a.received > b.received ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '10%'
    }
  ]

  return (
    <Table
      columns={invoicePending}
      dataSource={finalPayment}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default InvoicePending
