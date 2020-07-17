import React from 'react'
import { Table, Checkbox } from 'antd'
import mock from '../../../mock/partner/announcement'
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
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
      width:'50%'
    },
    {
      title: 'Published',
      dataIndex: 'reason',
      render: (text, record) => (
      <Checkbox onChange={onChange}></Checkbox>
      ),
      width:' 10%'
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
