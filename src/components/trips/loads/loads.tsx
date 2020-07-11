import tripsData from '../../../../mock/dashboard/tripsData'
import { Table } from 'antd'
import Link from 'next/link'

const TripStatus = () => {
  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href='/partners/partner/[id]' as={`/partners/partner/${record.id} `}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'Action',
      render: (text, record) => ('test')
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={tripsData}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 800, y: 220 }}
      pagination={false}
    />
  )
}

export default TripStatus
