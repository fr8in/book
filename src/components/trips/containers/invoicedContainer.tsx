import TripsTracking from '../tripsTracking'
import { useQuery } from '@apollo/client'
import { TRIPS_QUERY } from './query/tripsQuery'
import { useState } from 'react'
import get from 'lodash/get'

const DeliveredContainer = () => {
  const initialFilter = {
    offset: 0,
    limit: 3,
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    trip_statusId: [12, 13, 14, 15],
    id: null
  }
  const [filter, setFilter] = useState(initialFilter)

  const where = {
    _and: [{ trip_status: { id: { _in: [12, 13, 14, 15] } } }, { trip_pod_status: { name: { _neq: 'POD Dispatched' } } }],
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
    trip_statusId: initialFilter.trip_statusId
  }

  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('DeliveredContainer error', error)
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
    setFilter({ ...filter, partnername: value })
  }
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value })
  }
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value })
  }
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value })
  }
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusId: value })
  }
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value })
  }
  return (
    <TripsTracking
      trips={trip} loading={loading}
      filter={filter}
      record_count={record_count}
      onPageChange={onPageChange}
      onPartnerNameSearch={onPartnerNameSearch}
      onCustomerNameSearch={onCustomerNameSearch}
      onSourceNameSearch={onSourceNameSearch}
      onDestinationNameSearch={onDestinationNameSearch}
      onTruckNoSearch={onTruckNoSearch}
      onTripIdSearch={onTripIdSearch}
      trip_status_list={trip_status}
      onFilter={onFilter}
      delivered
    />
  )
}

export default DeliveredContainer
