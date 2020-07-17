import { Table, Input, Switch } from 'antd'
import {DownSquareOutlined} from '@ant-design/icons'
import mock from '../../../mock/customer/sourcingMock'

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
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
      dataIndex: 'status',
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
        dataIndex: 'priority',
        render: (text, record) => (
          <Switch onChange={onChange}></Switch>
          ),
      },
      {
          title: 'Action',
          dataIndex: 'action',
        },
  ]
  return (
    
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
   
  )
}

export default PartnerKyc
