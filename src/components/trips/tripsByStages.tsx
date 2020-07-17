import React from 'react'
import { Table } from 'antd'
//import mock from ''
const Partners = () => {
  const columnsCurrent = [
    {
      title: 'ID',
      dataIndex: 'code',
    },
    {
      title: 'OrderDate',
      dataIndex: 'date'
    },
    {
      title: 'Source',
      dataIndex: 'source'
    },
    {
      title: 'Destination',
      dataIndex: 'city'
    },
    {
      title: 'SourceIn',
      dataIndex: 'cityIn'
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
   
  ]
  return (
      <Table
        columns={columnsCurrent}
       // dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
  )
}

export default Partners
