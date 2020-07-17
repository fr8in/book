import { Table, Input } from 'antd'
import {DownSquareOutlined} from '@ant-design/icons'


const PartnerKyc = () => {
  const columnsCurrent = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'number',
            filterDropdown: (
              <div > 
                  <Input placeholder="Search Phone Number" />  
              </div>
            ),
          filterIcon:<DownSquareOutlined />
    },
    {
      title: 'City',
      dataIndex: 'cityName',
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
      dataIndex: 'source'
    },
    {
      title: 'Status',
      dataIndex: 'sttaus',
    },
    {
        title: 'Last Comment',
        dataIndex: 'comment',
      },
      {
        title: 'Created Date',
        dataIndex: 'date',
        sorter: true
      },
      {
        title: 'Priority',
        dataIndex: 'priority'
      },
      {
          title: 'Action',
          dataIndex: 'action',
        },
  ]
  return (
    
      <Table
        columns={columnsCurrent}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
   
  )
}

export default PartnerKyc
