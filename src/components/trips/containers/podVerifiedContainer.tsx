import TripsTracking from '../tripsTracking'
import { useQuery, useSubscription } from '@apollo/client'
import { TRIPS_QUERY, TRIPS } from './query/tripsQuery'
import { useState } from 'react'
import get from 'lodash/get'
import u from '../../../lib/util'
import { filterContext } from '../../../context'
import { useContext } from 'react'

const DeliveredContainer = (props) => {
  const {PodVerified_setCountFilter,PodVerified_countFilter} =props
  const initialFilter = {
    offset: 0,
    limit: u.limit,
    date_sort: 'desc',
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    trip_statusName: ['Delivered'],
    id: null
  }
  const [filter, setFilter] = useState(initialFilter)
  const {state} = useContext(filterContext)

  const where = {
    _and: [{ trip_status: { name: { _in: filter.trip_statusName } }, pod_verified_at: { _is_null: false } }],
    id: { _in: filter.id ? filter.id : null },
    partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
    customer: { name: { _ilike: filter.customername ? `%${filter.customername}%` : null } },
    source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
    destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
    truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } },
    branch: {region_id: {_in: (state.regions && state.regions.length > 0) ? state.regions : null}},
    branch_id: {_in: (state.branches && state.branches.length > 0) ? state.branches : null},
    source_connected_city_id: {_in:(state.cities && state.cities.length > 0) ? state.cities : null },
    truck_type_id: {_in: (state.types && state.types.length > 0) ? state.types : null},
    branch_employee_id: {_in:(state.managers && state.managers.length > 0) ? state.managers : null }
  }

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    date_sort: filter.date_sort,
    where: where
  }
  const status_fliter = {
    trip_statusName: initialFilter.trip_statusName,
    where: where
  }

  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: status_fliter,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('DeliveredContainer error', error)
  const { data: tripsdata, loading: tripsLoading } = useSubscription(
    TRIPS,
    {
      variables: variables
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  let _tripsdata = {}
  if (!tripsLoading) {
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
    PodVerified_setCountFilter({ ...PodVerified_countFilter,pod_verified_partnername:value })
  }
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value })
    PodVerified_setCountFilter({ ...PodVerified_countFilter,pod_verified_customername:value })
  }
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value })
  }
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value })
  }
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value })
    PodVerified_setCountFilter({ ...PodVerified_countFilter,pod_verified_truckno:value })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusName: value })
  }
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value })
  }
  return (
    <TripsTracking
      trips={trip} loading={tripsLoading}
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
