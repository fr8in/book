import React from 'react'
import unloading from '../../../mock/dashboard/unloading'
import { Table } from 'antd'
import PageLayout from '../../components/layout/PageLayout'

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
    <PageLayout title='FR8 - Dashboard'>
      <Table
        columns={columns}
        dataSource={unloading}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  )
}

export default Dashboard
