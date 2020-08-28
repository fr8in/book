import { Table } from 'antd'
import Link from 'next/link'
import CUSTOMER_TRIPS from './containers/query/customerTrips'
import { useSubscription } from '@apollo/client'
import get from 'lodash/get'

const CustomerTrips = (props) => {
  const { cardcode, status_names } = props
  console.log('status_names', status_names)

  const variables = {
    cardcode: cardcode,
    trip_status: status_names
  }

  const { loading, error, data } = useSubscription(
    CUSTOMER_TRIPS,
    {
      variables: variables
    }
  )
  console.log('CustomerTrips Error', error)
  let _data = []
  if (!loading) {
    _data = data
  }
  const trips = get(_data, 'customer[0].trips', [])
  const finalPaymentsPending = [
    {
      title: 'LoadId',
      dataIndex: 'id',
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: '6%',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Source',
      dataIndex: 'source',
      sorter: (a, b) => (a.source > b.source ? 1 : -1),
      width: '10%',
      render: (text, record) => record.source && record.source.name
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      sorter: (a, b) => (a.destination > b.destination ? 1 : -1),
      width: '10%',
      render: (text, record) => record.destination && record.destination.name
    },
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      sorter: (a, b) => (a.truckN0 > b.truckNo ? 1 : -1),
      width: '10%',
      render: (text, record) => record.truck && record.truck.truck_no
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '15%'
      // render: (text, record) =>
      //   record.truck.truck_type && record.truck.truck_type.name,
    },

    {
      title: 'SO Price',
      sorter: (a, b) => (a.soPrice > b.soPrice ? 1 : -1),
      width: '10%',
      render: (record) => {
        console.log()
        return (
          record.trip_prices &&
          record.trip_prices.length > 0 &&
          record.trip_prices[0].customer_price
        )
      }
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Aging',
      dataIndex: 'tat',
      sorter: (a, b) => (a.tat > b.tat ? 1 : -1),
      width: '10%'
    }
  ]

  return (
    <Table
      columns={finalPaymentsPending}
      dataSource={trips}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800 }}
      pagination={false}
      loading={loading}
    />
  )
}

export default CustomerTrips
