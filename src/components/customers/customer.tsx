import React from 'react'
import { Table, Input } from 'antd'
import {DownSquareOutlined} from '@ant-design/icons'
const VasRequest = () => {
  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'partnerCode',
    },
    {
      title: 'User',
      dataIndex: 'name'
    },
    {
        title: 'Phone',
        dataIndex: 'name',
              filterDropdown: (
                  <div > 
                      <Input placeholder="Search Phone Number" />  
                  </div>
                ),
              filterIcon:<DownSquareOutlined />
      },
      {
        title: 'City',
        dataIndex: 'city',
              filterDropdown: (
                  <div > 
                      <Input placeholder="Search City Name" />  
                  </div>
                ),
              filterIcon:<DownSquareOutlined />
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
              filterDropdown: (
                  <div > 
                      <Input placeholder="Search Employee Name" />  
                  </div>
                ),
              filterIcon:<DownSquareOutlined />
      },
      {
        title: 'Source',
        dataIndex: 'source',
        filterDropdown: (
            <div > 
                
            </div>
          ),
        filterIcon:<DownSquareOutlined />
      },
    {
        title: 'Status',
        dataIndex: 'status',
        filterDropdown: (
            <div > 
                 
            </div>
          ),
        filterIcon:<DownSquareOutlined />
      },
      {
        title: 'Comment',
        dataIndex: 'comment'
      },
      {
        title: 'Created Date',
        dataIndex: 'date',
        sorter:true,
      },
    {
        title: 'Priority',
        dataIndex: 'Priority'
      },
      {
        title: 'Action',
        dataIndex: 'action'
      }
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

export default VasRequest
