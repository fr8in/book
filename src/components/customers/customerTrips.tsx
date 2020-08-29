import { Table, Tooltip } from 'antd'
import Link from 'next/link'
import CUSTOMER_TRIPS from './containers/query/customerTrips'
import { useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'

const CustomerTrips = (props) => {
  const { cardcode, status_names, delivered } = props

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
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '6%',
      render: (text, record) => (
        <Link href='/trips/[id]' as={`/trips/${record.id} `}>
          <a>{text}</a>
        </Link>
      )
    },
    {
      title: 'O.Date',
      dataIndex: 'order_date',
      width: '8%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
    },
    {
      title: 'Truck No',
      sorter: (a, b) => (a.truckN0 > b.truckNo ? 1 : -1),
      width: '16%',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type = get(record, 'truck.truck_type.name', null)
        return (
          <Link href='/trucks/[id]' as={`/trucks/${truck_no} `}>
            <a>{`${truck_no} - ${truck_type ? truck_type.slice(0, 9) : '-'}`}</a>
          </Link>
        )
      }
    },
    {
      title: 'Partner',
      width: '10%',
      render: (text, record) => {
        const partner = get(record, 'partner.name', null)
        const cardcode = get(record, 'partner.cardcode', null)
        return (
          <Link href='/partners/[id]' as={`/partners/${cardcode} `}>
            <Tooltip title='partner'>
              <a>
                {partner && partner.length > 10 ? partner.slice(0, 10) + '...' : partner}
              </a>
            </Tooltip>
          </Link>
        )
      }
    },
    {
      title: 'Source',
      sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
      width: '10%',
      render: (text, record) => get(record, 'source.name', '-')
    },
    {
      title: 'Destination',
      sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
      width: '10%',
      render: (text, record) => get(record, 'destination.name', '-')
    },
    !delivered ? {
      title: 'Status',
      width: '11%',
      render: (text, record) => {
        const status = get(record, 'trip_status.name', '-')
        return <Truncate data={status} length={15} />
      }
    } : {},
    delivered ? {
      title: 'Pod Status',
      width: '11%',
      render: (text, record) => {
        const status = get(record, 'trip_pod_status.name', '-')
        return <Truncate data={status} length={15} />
      }
    } : {},
    {
      title: 'Receivable',
      width: '8%',
      sorter: (a, b) => (a.receivable > b.receivable ? 1 : -1),
      render: (record) => {
        const receivable = get(record, 'trip_receivables_aggregate.aggregate.sum.amount', null)
        return receivable
      }
    },
    {
      title: 'Receipts',
      width: '7%',
      sorter: (a, b) => (a.receipts > b.receipts ? 1 : -1),
      render: (record) => {
        const receipts = get(record, 'trip_receipts_aggregate.aggregate.sum.amount', null)
        return receipts
      }
    },
    {
      title: 'Balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '7%',
      render: (record) => {
        const receivable = get(record, 'trip_receivables_aggregate.aggregate.sum.amount', null)
        const receipts = get(record, 'trip_receipts_aggregate.aggregate.sum.amount', null)
        return (receivable - receipts)
      }
    },
    {
      title: 'Aging',
      dataIndex: 'tat',
      sorter: (a, b) => (a.tat > b.tat ? 1 : -1),
      width: '7%'
    }
  ]

  return (
    <Table
      columns={finalPaymentsPending}
      dataSource={trips}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
      loading={loading}
    />
  )
}

export default CustomerTrips
