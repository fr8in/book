import { Table, Tooltip, Button, Select, Space } from 'antd'
import { RocketFilled, DeleteOutlined, WhatsAppOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'

const ExcessLoadLead = (props) => {
  const { leads } = props
  const data = [{
    title: 'Partner Name',
    dataIndex: 'partner',
    key: 'partner',
    width: '30%',
    render: (text, record) => {
      const cardcode = record.partner && record.partner.cardcode
      const name = record.partner && record.partner.name
      return (
        <Link href='/partners/[id]' as={`/partners/${cardcode} `}>
          {name && name.length > 12
            ? <Tooltip title={name}><a>{name.slice(0, 12) + '...'}</a></Tooltip>
            : <a>{name}</a>}
        </Link>)
    }
  },
  {
    title: 'Partner No',
    width: '20%',
    render: (text, record) => record.partner && record.partner.partner_users && record.partner.partner_users[0].mobile
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    width: '20%',
    render: (text, record) => moment(text).format('DD-MMM-YY HH:mm')
  },
  {
    title: 'Action',
    render: (text, record) => (
      <Space>
        <Select
          placeholder='Select Truck'
        />
        <Button type='link' icon={<RocketFilled />} />
        <Tooltip title='Delete'>
          <Button type='link' danger icon={<DeleteOutlined />} />
        </Tooltip>
        {/* <Tooltip title='Double Click to Copy Text'>
          <Button type='link' icon={<WhatsAppOutlined />} />
        </Tooltip> */}
      </Space>
    ),
    width: '30%'
  }
  ]

  return (
    <Table
      columns={data}
      dataSource={leads}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      className='withAction'
    />

  )
}

export default ExcessLoadLead
