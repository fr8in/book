  
  import {Space, Table, Input, Switch, Popover, Button,Tooltip,Row } from 'antd'
import {DownSquareOutlined, CommentOutlined,CloseCircleTwoTone,ExclamationCircleTwoTone} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import mock from '../../../mock/customer/sourcingMock'



const content = (
  <div>
    <p> <ExclamationCircleTwoTone twoToneColor="#eca92b"/> Are you sure want to cancel the lead?</p>
    <Row justify='end' className='m5'>
      <Space>
      <Button>No</Button>
    <Button  type="primary">Yes</Button>
      </Space>
    </Row>
  </div>
);
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
const PartnerKyc = () => {
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
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
          render: (text, record) => (
            <span className='actions'>
              <Tooltip title='Comment'>
                <Button type='link' icon={<CommentOutlined />} onClick={() => onShow('comment')} />
              </Tooltip>
              <Popover content={content} >
    <CloseCircleTwoTone />
  </Popover>,
            </span>
          )
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
