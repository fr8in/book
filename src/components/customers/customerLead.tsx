import { Table, Input, Switch, Row, Button, Space, Tooltip, Popover } from 'antd'
import { SearchOutlined, ExclamationCircleTwoTone, CommentOutlined, CloseCircleOutlined } from '@ant-design/icons'
import mock from '../../../mock/customer/sourcingMock'

const CusSource = [
  { value: 1, text: 'DIRECT' },
  { value: 2, text: 'SOCIAL MEDIA' },
  { value: 3, text: 'REFERRAL' },
  { value: 4, text: 'APP' }
]
const CusState = [
  { value: 1, text: 'OPEN' },
  { value: 2, text: 'ON-BOARDED' },
  { value: 3, text: 'REJECTED' }
]

const content = (
  <div>
    <p> <ExclamationCircleTwoTone twoToneColor='#eca92b' /> Are you sure want to cancel the lead?</p>
    <Row justify='end' className='m5'>
      <Space>
        <Button>No</Button>
        <Button type='primary'>Yes</Button>
      </Space>
    </Row>
  </div>
)

const CustomerLead = () => {
  const onChange = (checked) => {
    console.log(`checked = ${checked}`)
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    })
  }
  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'company'
    },
    {
      title: 'User',
      dataIndex: 'name'
    },
    {
      title: 'Phone',
      dataIndex: 'number',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Phone Number'
            id='number'
            name='number'
            type='number'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search City Name'
            id='cityName'
            name='cityName'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Employee Name'
            id='owner'
            name='owner'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Source',
      dataIndex: 'source',
      filters: CusSource
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: CusState
    },
    {
      title: 'Comment',
      dataIndex: 'comment'
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
        <Switch onChange={onChange} />
      )
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} />
          </Tooltip>
          <Popover content={content}>
            <Button type='link' icon={<CloseCircleOutlined />} />
          </Popover>,
        </span>
      )
    }
  ]
  return (
    <Table
      rowSelection={{
        ...rowSelection
      }}
      columns={columnsCurrent}
      dataSource={mock}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 1156 }}
      pagination={false}
    />
  )
}

export default CustomerLead
