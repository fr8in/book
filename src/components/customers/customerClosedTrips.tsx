import { useState } from 'react'
import { Table, Pagination } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import u from '../../lib/util'

const CLOSED_TRIPS = gql`
subscription customer_trip_list($cardcode: String, $trip_status: [String!],$limit: Int!, $offset:Int!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    trips_aggregate(where:{trip_status:{name:{_in:$trip_status}}}){
      aggregate{
        count
      }
    }
    trips(limit: $limit, offset: $offset, where:{trip_status:{name:{_in:$trip_status}}}) {
      id
      order_date
      truck {
        truck_no
        truck_type {
          name
        }
      }
      source {
        name
      }
      destination {
        name
      }
      partner {
        cardcode
        name
      }
      trip_status {
        name
      }
      # trip_pod_status{
      #   name
      # }
       customer_price
        partner_price
    }
  }
}`

const recieved = ['Recieved', 'Closed']

const CustomerClosedTrips = (props) => {
  const { cardcode } = props

  const initialFilter = {
    offset: 0,
    limit: u.limit
  }
  const [filter, setFilter] = useState(initialFilter)
  const [currentPage, setCurrentPage] = useState(1)

  const variables = {
    cardcode: cardcode,
    trip_status: recieved,
    limit: filter.limit,
    offset: filter.offset
  }

  const { loading, error, data } = useSubscription(
    CLOSED_TRIPS,
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
  const record_count = get(_data, 'customer[0].trips_aggregate.aggregate.count', 0)

  const onPageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }

  const column = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '6%',
      render: (text, record) => (
        <LinkComp
          type='trips'
          data={text}
          id={record.id}
        />
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
        const truck_type_name = get(record, 'truck.truck_type.name', null)
        const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
        return (
          <LinkComp
            type='trucks'
            data={`${truck_no} - ${truck_type}`}
            id={truck_no}
          />)
      }
    },
    {
      title: 'Partner',
      width: '10%',
      render: (text, record) => {
        const partner = get(record, 'partner.name', null)
        const cardcode = get(record, 'partner.cardcode', null)
        return (
          <LinkComp
            type='partners'
            data={partner}
            id={cardcode}
            length={10}
          />)
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
    {
      title: 'SO Price',
      width: '8%',
      sorter: (a, b) => (a.customer_price > b.customer_price ? 1 : -1),
      render: (record) => get(record, 'customer_price', null)
    },
    {
      title: 'PO Price',
      width: '7%',
      sorter: (a, b) => (a.partner_price > b.partner_price ? 1 : -1),
      render: (record) => get(record, 'partner_price', null)
    },
    {
      title: 'Status',
      width: '11%',
      render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={15} />
    }
  ]

  return (
    <>
      <Table
        columns={column}
        dataSource={trips}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 800, y: 360 }}
        pagination={false}
        loading={loading}
      />
      {!loading && (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={onPageChange}
          className='text-right p10'
        />
      )}
    </>
  )
}

export default CustomerClosedTrips
