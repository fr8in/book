
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
          <Link href='trucks/truck/[id]' as={`trucks/truck/${record.id}`}>
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
          <Link href='trips/trip/[id]' as={`trips/trip/${record.id}`}>
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
          <Link href='partners/partner/[id]' as={`partners/partner/${record.id}`}>
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
      size='middle'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Trucks
