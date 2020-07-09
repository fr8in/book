import React from 'react'
import unloading from '../../../mock/dashboard/unloading'
import { Table } from 'antd'

const Dashboard = () => {
  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Action',
      render: (text, record) => ('test')
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={unloading}
      rowKey={record => record.id}
      size='middle'
      pagination={false}
    />
  )
}

export default Dashboard
