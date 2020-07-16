
import { Table,Tooltip,Button} from 'antd'
import { CheckOutlined, DeleteOutlined, WhatsAppOutlined } from '@ant-design/icons'
import Search from 'antd/lib/input/Search'

const ExcessLoadLead = (props) => {
  const data =[{
    title: 'Partner Name',
    dataIndex: 'partner',
    key: 'partner',
    width: '30%',
  },
  {
    title: 'Partner No',
    dataIndex: 'phone',
    key: 'phone',
    width: '30%'
  },
  {
    title: 'Date',
    dataIndex: 'createdOn',
    key: 'createdOn',
    width: '20%'
  },
  {
    title: 'Action',
    render: (text, record) => (
      <span className='actions'>
        <Search
        placeholder="Select Truck"
        enterButton="Search"
       />
       <Button type='link' icon={<CheckOutlined />}  />
       <Tooltip title='Delete'>
       <Button type='link' disabled icon={<DeleteOutlined />} />
       </Tooltip>
          <span>
            <Tooltip title='Double Click to Copy Text'>
              <Button type='link' icon={<WhatsAppOutlined />} />
            </Tooltip>
          </span>
        </span>
    ),
    width: '20%'
  }
  ]

  return (
    <Table
    columns={data}
    dataSource={props.lead}
    rowKey={record => record.id}
    size='small'
    scroll={{ x: 1156 }}
    pagination={false}
  />
    
  )
}

export default ExcessLoadLead
