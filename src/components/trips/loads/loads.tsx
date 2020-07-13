import tripsData from '../../../../mock/trip/tripsData'
import { Table } from 'antd'
import Link from 'next/link'

const Load = () => {
  const callDriver = record => {
    window.location.href = 'tel:' + record.driverNo
  }
  const columns = [
    {
      title: 'Load Id',
      dataIndex: 'id',
      width: '6%',
      render: (text, record) => {
        return (
          <Link href='/trips/trip/[id]' as={`/trips/trip/${record.id} `}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      render: (text, record) => {
        return (
          <Link href='/customers/customer/[id]' as={`/customers/customer/${record.customerId} `}>
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
      title: 'Driver No',
      dataIndex: 'driverNo',
      width: '8%',
      render: (text, record) => {
        return (
          <span onClick={() => callDriver(record)} className='link'>{text}</span>
        )
      }
    },
    {
      title: 'Truck',
      dataIndex: 'truck',
      render: (text, record) => {
        return (
          <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.truckId} `}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Source',
      dataIndex: 'source'
    },
    {
      title: 'Destination',
      dataIndex: 'destination'
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      width: '5%'
    },
    {
      title: 'Comment',
      dataIndex: 'comment'
    },
    {
      title: 'Action',
      width: '8%',
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

export default Load
