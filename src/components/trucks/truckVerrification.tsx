import React from 'react'
import { Table } from 'antd'
import mock from '../../../mock/partner/sourcingMock'
import Link from 'next/link'

const status = [
  { value: 1, text: 'Verification Pending' },
  { value: 2, text: 'Rejected' },
]
const truckVerification = () => {
  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href="trucks/[id]" as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
      width:'10%'
    },
    {
      title: 'Partner Code',
      dataIndex: 'code',
      render: (text, record) => {
        return (
          <Link href="partners/[id]" as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
      width:'15%'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      width:'15%'
    },
    {
      title: 'Truck Status',
      dataIndex: 'status',
      filters: status,
      width:'12%'
    },
    {
      title: 'Reject Reason',
      dataIndex: 'reason',
      width:'48%'
    }
  ]
  return (
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
  )
}

export default truckVerification
