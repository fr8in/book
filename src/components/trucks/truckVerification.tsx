import { Table, Button, Space } from 'antd'
import mock from '../../../mock/partner/sourcingMock'
import Link from 'next/link'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const status = [
  { value: 1, text: 'Verification Pending' },
  { value: 2, text: 'Rejected' }
]
const TruckVerification = () => {
  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
      width: '10%'
    },
    {
      title: 'Partner Code',
      dataIndex: 'code',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
      width: '10%'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      width: '18%'
    },
    {
      title: 'Truck Status',
      dataIndex: 'status',
      filters: status,
      width: '17%'
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, record) => {
        return (
          <Space>
            <Button type='primary' className='btn-success' icon={<CheckOutlined />} />
            <Button type='primary' danger icon={<CloseOutlined />} />
          </Space>
        )
      }
    },
    {
      title: 'Reject Reason',
      dataIndex: 'reason',
      width: '35%'
    }
  ]
  return (
    <Table
      columns={columnsCurrent}
      dataSource={mock}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 1150 }}
      pagination={false}
    />
  )
}

export default TruckVerification
