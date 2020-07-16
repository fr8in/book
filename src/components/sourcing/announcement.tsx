import React from 'react'
import { Table } from 'antd'
import mock from '../../../mock/sourcing/announcement'
const Announcement = () => {
  const columnsCurrent = [
    {
      title: 'Date',
      dataIndex: 'date',
      width:' 10%'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      width:' 15%'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width:' 15%'
    },
    {
      title: 'Description',
      dataIndex: 'detail',
      width:'45%'
    },
    {
      title: 'Published',
      dataIndex: 'reason',
      width:' 15%'
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

export default Announcement
