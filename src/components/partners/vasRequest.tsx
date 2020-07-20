import React from 'react'
import { Table } from 'antd'
import mock from '../../../mock/customer/sourcingMock'
const VasRequest = () => {
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'partnerCode',
      width:'12%'
    },
    {
      title: 'Partner Name',
      dataIndex: 'name',
      width:'12%'
    },
    {
      title: '	Contact No',
      dataIndex: 'number',
      width:'13%'
    },
    {
      title: '	Requested Service',
      dataIndex: 'service',
      width:'13%'
    },
    {
      title: 'Request Date',
      dataIndex: 'date',
      width:'12%'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width:'12%'
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width:'25%'
      }
  ]
  return (
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 1156 }}
        pagination={false}
      />
  )
}

export default VasRequest
