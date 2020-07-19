import React from 'react'
import { Table,Button } from 'antd'
import {DownloadOutlined} from '@ant-design/icons'
import mock from '../../../mock/customer/sourcingMock'
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
      return: (
        <div > 
         <Button type="primary" icon={<DownloadOutlined />} />
      </div>
    ),
      width:'30%'
        
    },
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

export default Breakdown
