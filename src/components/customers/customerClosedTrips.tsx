import { useState } from 'react'
import { Table, Pagination, Input } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import { SearchOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import u from '../../lib/util'
import PartnerLink from '../common/PartnerLink'
const CLOSED_TRIPS = gql`
subscription customer_closed_trip_list($cardcode: String,$where: trip_bool_exp,$limit: Int!, $offset:Int!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    trips_aggregate(where:$where){
      aggregate{
        count
      }
    }
    trips(limit: $limit, offset: $offset, where:$where) {
      id
      created_at
      truck {
        truck_no
        truck_type {
          name
          code
        }
      }
      source {
        name
      }
      destination {
        name
      }
      partner {
        id
        cardcode
        name
      }
      trip_status {
        name
      }
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
    limit: u.limit,
    partnername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
  }
  const [filter, setFilter] = useState(initialFilter)
  const [currentPage, setCurrentPage] = useState(1)

  const variables = {
    cardcode: cardcode,
    limit: filter.limit,
    offset: filter.offset,
    where: {
      trip_status: { name: { _in: recieved } },
      partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
      source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
      destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
      truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } }
    }
  }

  const { loading, error, data } = useSubscription(
    CLOSED_TRIPS,
    {
      variables: variables
    }
  )

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

  const onTruckNoSearch = (e) => {
    setFilter({ ...filter, truckno: e.target.value, offset: 0 })
    setCurrentPage(1)
  }
  const onPartnerNameSearch = (e) => {
    setFilter({ ...filter, partnername: e.target.value, offset: 0 })
    setCurrentPage(1)
  }
  const onSourceNameSearch = (e) => {
    setFilter({ ...filter, sourcename: e.target.value, offset: 0 })
    setCurrentPage(1)
  }
  const onDestinationNameSearch = (e) => {
    setFilter({ ...filter, destinationname: e.target.value, offset: 0 })
    setCurrentPage(1)
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
      dataIndex: 'created_at',
      width: '8%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
    },
    {
      title: 'Truck No',
      width: '16%',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_name = get(record, 'truck.truck_type.code', null)
        const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
        return (
          <LinkComp
            type='trucks'
            data={`${truck_no} - ${truck_type}`}
            id={truck_no}
          />)
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.truckno}
          onChange={onTruckNoSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Partner',
      width: '10%',
      render: (text, record) => {
        const id = get(record, 'partner.id', null)
        const partner = get(record, 'partner.name', null)
        const cardcode = get(record, 'partner.cardcode', null)
        return (
          <PartnerLink
            type='partners'
            data={partner}
            id={id}
            cardcode={cardcode}
            length={10}
          />)
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.partnername}
          onChange={onPartnerNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Source',
      width: '10%',
      render: (text, record) => get(record, 'source.name', '-'),
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.sourcename}
          onChange={onSourceNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Destination',
      width: '10%',
      render: (text, record) => get(record, 'destination.name', '-'),
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.destinationname}
          onChange={onDestinationNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
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
