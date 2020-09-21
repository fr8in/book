import TripsTracking from '../tripsTracking'
import { useQuery,useSubscription } from '@apollo/client'
import { TRIPS_QUERY,TRIPS } from './query/tripsQuery'
import { useState } from 'react'
import get from 'lodash/get'
import u from '../../../lib/util'

const DeliveredContainer = () => {
  const initialFilter = {
    offset: 0,
    limit: u.limit,
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    trip_statusName: ['Delivered'],
    id: null
  }
  const [filter, setFilter] = useState(initialFilter)

  const where = {
    _and: [{ trip_status: { name: { _in: filter.trip_statusName } }, pod_verified_at: { _is_null: false } }],
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
    where: where
  }

  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('DeliveredContainer error', error)
  const { data: tripsdata} = useSubscription(
    TRIPS,
    {
      variables: variables
    }
  )

  var _data = {}
  var _tripsdata = {}
  if (!loading) {
    _data = data
    _tripsdata = tripsdata
  }
  // all trip data
  const trip = get(_tripsdata, 'trip', [])
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
    setFilter({ ...filter, trip_statusName: value })
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
      verified
    />
  )
}

export default DeliveredContainer
