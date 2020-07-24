import React from 'react'
import { Table } from 'antd'
import Payables from '../../../mock/payables/payables'

const DownPayment = () => {
  const DownPayment = [
    {
      title: 'Load ID',
      dataIndex: 'loadId',
      key: 'loadId',
      width: '4%',
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1)
    },
    {
      title: 'Vendor Code',
      dataIndex: 'vendorCode',
      key: 'vendorCode',
      width: '5%',
      sorter: (a, b) => (a.vendorCode > b.vendorCode ? 1 : -1)
    },
    {
      title: 'Advance Percentage',
      dataIndex: 'advancePercentage',
      key: 'advancePercentage',
      sorter: (a, b) => (a.advancePercentage > b.advancePercentage ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: (a, b) => (a.accountName > b.accountName ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      sorter: (a, b) => (a.accountNumber > b.accountNumber ? 1 : -1),
      width: '8%'
    },
    {
      title: 'IFSC Code',
      dataIndex: 'ifscCode',
      key: 'ifscCode',
      sorter: (a, b) => (a.ifscCode > b.ifscCode ? 1 : -1),
      width: '5%'
    },
    {
      title: 'Bank',
      dataIndex: 'bank',
      key: 'bank',
      sorter: (a, b) => (a.bank > b.bank ? 1 : -1),
      width: '5%'
    },

    {
      title: 'Cash',
      dataIndex: 'cash',
      key: 'cash',
      sorter: (a, b) => (a.cash > b.cash ? 1 : -1),
      width: '5%'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => (a.total > b.total ? 1 : -1),
      width: '5%'
    }
  ]

  return (
    <Table
      columns={DownPayment}
      dataSource={Payables}
      size='small'
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  )
}

export default DownPayment
