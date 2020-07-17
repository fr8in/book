import React from 'react'
import { Table } from 'antd'

const Breakdown = () => {
  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'company',
      sorter:true,
      width:'35%'
    },
    {
      title: 'Truck',
      dataIndex: 'truck',
      width:'35%'
    },
    {
      title: 'City',
      dataIndex: 'city',
      width:'30%'
        
    },
  ]
  return (
      <Table
        columns={columnsCurrent}
       //  dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
  )
}

export default Breakdown
