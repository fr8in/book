import loadData from '../../../../mock/trucks/loadData'
import { Table } from 'antd'
import Link from 'next/link'

const WaitingForLoad = () => {
  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.id} `}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      render: (text, record) => {
        return (
          <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partnerId} `}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Partner No',
      dataIndex: 'partnerNo'
    },
    {
      title: 'City',
      dataIndex: 'city'
    },
    {
      title: 'TAT',
      dataIndex: 'tat'
    },
    {
      title: 'Comment',
      dataIndex: 'comment'
    },
    {
      title: 'Action',
      render: (text, record) => ('test')
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={loadData}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 800, y: 220 }}
      pagination={false}
    />
  )
}

export default WaitingForLoad
