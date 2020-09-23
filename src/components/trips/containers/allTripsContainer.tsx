import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'
import Trips from '../trips'
import u from '../../../lib/util'

const TRIPS_QUERY = gql`
query trips(
  $offset: Int!, 
  $limit: Int!,
  $trip_statusName: [String!],
  $where: trip_bool_exp){
  rows: trip_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  trip_status(where: {name: {_in: $trip_statusName}}) {
    id
    name
  }
  trip(offset: $offset, limit: $limit, where:$where)
    {
    id
    order_date
    customer {
      name
      cardcode
    } 
    partner {
      name
      cardcode
    }
    truck {
      truck_no
    }
    source {
      name
    }
    destination {
      name
    }
    trip_status{
      name
    }
    km    
    tat
    customer_price
    partner_price 
  }
}`

const AllTripsContainer = (props) => {
  const initialFilter = {
    offset: 0,
    limit: u.limit,
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    id: null,
    trip_statusName: ['Delivered', 'Invoiced', 'Paid', 'Recieved', 'Closed']
  }
  const [filter, setFilter] = useState(initialFilter)

  const where = {
    _and: [{ trip_status: { name: { _in: filter.trip_statusName && filter.trip_statusName.length > 0 ? filter.trip_statusName : initialFilter.trip_statusName } } }],
    id: { _in: filter.id ? filter.id : null },
    partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
    customer: { name: { _ilike: filter.customername ? `%${filter.customername}%` : null } },
    source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
    destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
    truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } }
  }

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    where: where,
    trip_statusName: initialFilter.trip_statusName
  }

  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('AllTripsContainer error', error)
  var _data = {}
  if (!loading) {
    _data = data
  }
  // all trip data
  const trip = get(_data, 'trip', [])
  // for pagination
  const record_count = get(_data, 'rows.aggregate.count', 0)

  // for filter options
  const trip_status = get(_data, 'trip_status', [])

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }
  const onPartnerNameSearch = (value) => {
    setFilter({ ...filter, partnername: value, offset: 0 })
  }
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value, offset: 0 })
  }
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value, offset: 0 })
  }
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value, offset: 0 })
  }
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value, offset: 0 })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusName: value, offset: 0 })
  }
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value, offset: 0 })
  }
  return (
    <Trips
      trips={trip}
      loading={loading}
      record_count={record_count}
      filter={filter}
      onPageChange={onPageChange}
      onPartnerNameSearch={onPartnerNameSearch}
      onCustomerNameSearch={onCustomerNameSearch}
      onSourceNameSearch={onSourceNameSearch}
      onDestinationNameSearch={onDestinationNameSearch}
      onTruckNoSearch={onTruckNoSearch}
      onTripIdSearch={onTripIdSearch}
      trip_status_list={trip_status}
      onFilter={onFilter}
    />
  )
}

export default AllTripsContainer
