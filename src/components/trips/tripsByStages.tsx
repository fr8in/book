import React from 'react'
import { Table } from 'antd'

const Partners = () => {
  const columnsCurrent = [
    {
      title: 'ID',
      dataIndex: 'partnerCode',
    },
    {
      title: 'OrderDate',
      dataIndex: 'name'
    },
    {
      title: 'Source',
      dataIndex: 'regionName'
    },
    {
      title: 'Destination',
      dataIndex: 'mobileNo'
    },
    {
      title: 'SourceIn',
      dataIndex: 'email'
    },
    {
      title: 'Status',
      dataIndex: 'averageKm',
    },
   
  ]
  return (
      <Table
        columns={columnsCurrent}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
  )
}

export default Partners
