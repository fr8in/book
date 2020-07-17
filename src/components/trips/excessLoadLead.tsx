
import { Table, Tooltip, Button, Input, Space } from 'antd'
import { CheckOutlined, DeleteOutlined, WhatsAppOutlined } from '@ant-design/icons'

const ExcessLoadLead = (props) => {
  const data = [{
    title: 'Partner Name',
    dataIndex: 'partner',
    key: 'partner',
    width: '20%'
  },
  {
    title: 'Partner No',
    dataIndex: 'phone',
    key: 'phone',
    width: '20%'
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
      <Space>
        <Input
          placeholder='Select Truck'
        />
        <Button type='link' icon={<CheckOutlined />} />
        <Tooltip title='Delete'>
          <Button type='link' icon={<DeleteOutlined />} />
        </Tooltip>
        <span>
          <Tooltip title='Double Click to Copy Text'>
            <Button type='link' icon={<WhatsAppOutlined />} />
          </Tooltip>
        </span>
      </Space>
    ),
    width: '40%'
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
      className='withAction'
    />

  )
}

export default ExcessLoadLead
