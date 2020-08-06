import Trips from '../trips'
import { useQuery } from '@apollo/client'
import { TRIPS_QUERY } from './query/tripsQuery'
import { useState } from 'react'

const InvoicedContainer = () => {
  const initialFilter = {
    offset: 0,
    limit: 3,
    name: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    trip_statusId: [12, 13, 14, 15],
    id: null
  };
  const [filter, setFilter] = useState(initialFilter);
  const where = {
    partner: {
      name: { _ilike: filter.name ? `%${filter.name}%` : null }
    },
    customer: {
      name: { _ilike: filter.customername ? `%${filter.customername}%` : null }
    },
    source: {
      name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null }
    },
    destination: {
      name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null }
    },
    truck: {
      truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null }
    },
    trip_status: {
      id: { _in: filter.trip_statusId }
    },
    id: { _in: filter.id },
  }

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    where: where,
  }

  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: variables,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('InvoicedContainer error', error)
  var trip = []
  var trip_status = []
  var invoiced = []
  if (!loading) {
    trip = data.trip
    trip_status = data.trip_status;
    invoiced = data && data.invoiced
  }

  const trip_status_list = trip_status.filter((data) => data.id !== 16);

  const record_count =
  invoiced.aggregate && invoiced.aggregate.count;
  const total_page = Math.ceil(record_count / filter.limit);
  console.log("record_count", record_count);

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value });
  };
  const onPartnerNameSearch = (value) => {
    setFilter({ ...filter, name: value });
  };
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value });
  };
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value });
  };
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value });
  };
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value });
  };
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusId: value });
  };
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value });
  };
  return (
    <Trips trips={trip} loading={loading}
      filter={filter}
      record_count={record_count}
      total_page={total_page}
      onPageChange={onPageChange}
      onPartnerNameSearch={onPartnerNameSearch}
      onCustomerNameSearch={onCustomerNameSearch}
      onSourceNameSearch={onSourceNameSearch}
      onDestinationNameSearch={onDestinationNameSearch}
      onTruckNoSearch={onTruckNoSearch}
      onTripIdSearch={onTripIdSearch}
      onFilter={onFilter}
      trip_status_list={trip_status_list}
      delivered />
  )
}

export default InvoicedContainer
