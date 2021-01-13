import { useState } from 'react'
import { Table, Pagination, Checkbox } from 'antd'
import moment from 'moment'
import LinkComp from '../common/link'
import get from 'lodash/get'
import Truncate from '../common/truncate'
import { gql, useQuery } from '@apollo/client'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const PARTNER_TRIPS_QUERY = gql`
query partner_trips($offset: Int, $limit: Int, $cardcode: String, $truck_no: [String!],$status:[String!]) {
  trip(offset: $offset, limit: $limit, where: {partner: {cardcode: {_eq: $cardcode}}, truck: {truck_no: {_in: $truck_no}} trip_status:{name:{_in:$status}}}) {
    id
    created_at
    km
    avg_km_day
    trip_status {
      name
    }
    source {
      name
    }
    destination {
      name
    }
    truck {
      truck_no
      truck_type {
        code
      }
    }
  }
  truck(where: {partner: {cardcode: {_eq: $cardcode}}}) {
    truck_no
  }
  trip_status {
    name
  }
  trip_aggregate( where: {partner: {cardcode: {_eq: $cardcode}}, truck: {truck_no: {_in: $truck_no}} trip_status:{name:{_in:$status}}}) {
    aggregate{
      count
    }
  }
}
`

const PartnerBasedTrips = (props) => {
  const { cardcode,onCountChange} = props

  const initialFilter = {
    offset: 0,
    limit: u.limit,
    status: null,
    truck_no : null
  }
  const [filter, setFilter] = useState(initialFilter)
  const [currentPage, setCurrentPage] = useState(1)

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    cardcode: cardcode,
    status: !isEmpty(filter.status) ? filter.status : null ,
    truck_no: !isEmpty(filter.truck_no) ? filter.truck_no : null ,
  }

  const { loading, error, data } = useQuery(
    PARTNER_TRIPS_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerTrips = get(_data, 'trip', [])

  const trucks = get(_data, 'truck', [])
  const status = get(_data, 'trip_status', [])
  const record_count = get(_data, 'trip_aggregate.aggregate.count', 0)

  const partner_trucks = trucks.map((data) => {
    return { value: data.truck_no, label: data.truck_no }
  })
  const trip_status = status.map((data) => {
    return { value: data.name, label: data.name }
  })

  const onPageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }

  const handleTruckNo = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, truck_no: checked, offset: 0 })
    onCountChange({...filter, truck_no: checked})
  }
  const handleStatus = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, status: checked, offset: 0 })
    onCountChange({...filter, status: checked})
  }

  const columnsCurrent = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '8%',
      render: (text, record) => (
        <LinkComp
          type='trips'
          data={record.id}
          id={record.id}
        />),
      sorter: (a, b) => (a.id > b.id ? 1 : -1)
    },
    {
      title: 'Order date',
      dataIndex: 'created_at',
      width: '10%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
    },
    {
      title: 'Truck',
      width: '16%',
      filterDropdown: (
        <Checkbox.Group
          options={partner_trucks}
          defaultValue={filter.truck_no}
          onChange={handleTruckNo}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type = get(record, 'truck.truck_type.code', null)
        return (
          <LinkComp
            type='trucks'
            data={truck_no + ' - ' + truck_type}
            id={truck_no}
            length={32}
          />
        )
      }
    },
    {
      title: 'Source',
      dataIndex: 'source',
      width: '16%',
      render: (text, record) => <Truncate data={get(record, 'source.name', '-')} length={20} />,
    },
    {
      title: 'Destination',
      width: '16%',
      render: (text, record) => <Truncate data={get(record, 'destination.name', '-')} length={20} />,
    },
    {
      title: 'Km',
      dataIndex: 'km',
      width: '10%',
      render: (text, record) => (record.km || '-')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '12%',
      render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={9} />,
      filterDropdown: (
        <Checkbox.Group
          options={trip_status}
          defaultValue={filter.status}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
    },
    {
      title: 'AVG KM/Day',
      dataIndex: 'avg_km_day',
      width: '12%',
      render: (text, record) => (record.avg_km_day || '-')
    }

  ]
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={partnerTrips}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 900, y: 350 }}
        pagination={false}
        loading={loading}
      />
      {!loading && record_count &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={onPageChange}
          className='text-right p10'
        />}
    </>
  )
}
export default PartnerBasedTrips
