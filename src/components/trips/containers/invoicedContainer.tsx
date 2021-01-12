import TripsTracking from '../tripsTracking'
import { useQuery, useSubscription } from '@apollo/client'
import { TRIPS_QUERY, TRIPS } from './query/tripsQuery'
import { useState } from 'react'
import get from 'lodash/get'
import u from '../../../lib/util'
import isEmpty from 'lodash/isEmpty'

const InvoicedContainer = (props) => {
  const {invoiced_setCountFilter,invoiced_countFilter,payment_Manager} =props

  const initialFilter = {
    offset: 0,
    limit: u.limit,
    date_sort: 'desc',
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    paymentmanagername: null,
    truckno: null,
    id: null,
    trip_statusName: ['Invoiced', 'Paid', 'Recieved', 'Closed']
  }
  const [filter, setFilter] = useState(initialFilter)

  const where = {
    _and: [{ trip_status: { name: { _in: filter.trip_statusName && filter.trip_statusName.length > 0 ? filter.trip_statusName : initialFilter.trip_statusName } }, pod_dispatched_at: { _is_null: true } }],
    id: { _in: filter.id ? filter.id : null },
    partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
    ...!isEmpty(payment_Manager) ? {customer:{payment_manager:{name : {_in : payment_Manager && payment_Manager.length > 0 ? payment_Manager : initialFilter.paymentmanagername }},name: { _ilike: filter.customername ? `%${filter.customername}%` : null }}} : [],
    source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
    destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
    truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } }
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

  const { loading: sloading, error: serror, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: status_fliter,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  const { data: tripsdata, loading, error } = useSubscription(
    TRIPS,
    {
      variables: variables
    }
  )
  console.log('InvoicedContainer error', error)
  console.log('InvoicedContainer Status Error', serror)

  let _tripsdata = {}
  if (!loading) {
    _tripsdata = tripsdata
  }
  let _data = {}
  if (!sloading) {
    _data = data
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
    invoiced_setCountFilter({ ...invoiced_countFilter,invoiced_partnername:value })
  }
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value })
    invoiced_setCountFilter({ ...invoiced_countFilter,invoiced_customername:value })
  }
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value })
  }
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value })
  }
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value })
    invoiced_setCountFilter({ ...invoiced_countFilter,invoiced_truckno:value })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusName: value })
  }
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value })
  }
  const onPaymentManagerNameSearch = (value) => {
    setFilter({ ...filter, paymentmanagername: value })
    invoiced_setCountFilter({ ...invoiced_countFilter,invoiced_paymentmanagername:value })
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
      invoiced_setCountFilter={invoiced_setCountFilter}
      invoiced_countFilter={invoiced_countFilter}
      onPaymentManagerNameSearch={onPaymentManagerNameSearch}
      invoiced
      {...props}
    />
  )
}

export default InvoicedContainer
