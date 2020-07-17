
import trucks from '../../../mock/trucks/trucks'
import { Table } from 'antd'
import Link from 'next/link'

const Trucks = () => {
  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }

    },
    {
      title: 'Trip Id',
      dataIndex: 'tripId',
      render: (text, record) => {
        return (
          <Link href='trips/[id]' as={`trips/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }

    },
    {
      title: 'Trip',
      dataIndex: 'trip',

    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }

    },
    {
      title: 'Phone No',
      dataIndex: 'phoneNo'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'city',
      dataIndex: 'city'
    }]

  return (
    <Table
      columns={columns}
      dataSource={trucks}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 800, y: 850 }}
      pagination={false}
    />
  )
}

export default Trucks
