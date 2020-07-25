import { Table, Input, Switch, Button, Tooltip, Popconfirm, Space } from 'antd'
import { SearchOutlined, CommentOutlined, CloseOutlined } from '@ant-design/icons'
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
      sorter: (a, b) => (a.date > b.date ? 1 : -1)
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (text, record) => (
        <Switch onChange={onChange} size='small' />
      )
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Space>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} />
          </Tooltip>
          <Popconfirm
            title='Are you sure want to Reject the lead?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => console.log('Rejected!')}
          >
            <Button type='primary' size='small' shape='circle' danger icon={<CloseOutlined />} />
          </Popconfirm>
        </Space>
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
