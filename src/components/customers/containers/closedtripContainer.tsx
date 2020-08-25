import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import React from 'react'
import Trip from '../../trips/trips' 
import get from 'lodash/get'

const CLOSEDTRIP_QUERY = gql`
query trip($cardcode:String,$offset: Int, $limit: Int,$trip_statusName:[String!],$name: String, 
  $customername:String,
  $sourcename:String,
  $destinationname:String,
  $truckno:String,
  $where: trip_bool_exp){
    customer(where:{cardcode:{_eq:$cardcode}})
    {
      cardcode
      trips(offset: $offset, limit: $limit,where:$where){
        id
       order_date
        customer{
          name
        }
        partner{
          name
        }
        truck{
          truck_no
          truck_type{
            name
          }
        }
        source{
          name
        }
        destination{
          name
        }
        trip_status{
          name
        }
        trip_prices{
          customer_price
          partner_price
        }
        km
      }
    }
    trip_status(where: {name: {_in: $trip_statusName}}, order_by: {id: asc}) {
      id
      name
    }
  }
  `
  
const ClosedTripContainer = (props) => {
  const initialFilter = {
    offset: 0,
    limit: 3,
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    id: null,
    trip_statusName: ['Delivered', 'Approval Pending', 'POD Verified', 'Invoiced','Paid', 'Received', 'Closed']
  };
  const [filter, setFilter] = useState(initialFilter);

  const where = {
    _and: [{ trip_status: { name: { _in: filter.trip_statusName && filter.trip_statusName.length > 0 ? filter.trip_statusName : initialFilter.trip_statusName } } }],
    id: { _in: filter.id ? filter.id : null },
    partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
    customer: { name: { _ilike: filter.customername ? `%${filter.customername}%` : null } },
    source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
    destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
    truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } }
  }

  const { cardcode } = props
  const variables = {
    cardcode: cardcode,
    where: where,
    offset: filter.offset,
    limit: filter.limit,
    trip_statusName: initialFilter.trip_statusName
  }
  console.log('variables',variables)
  const { loading, error, data } = useQuery(
    CLOSEDTRIP_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('ClosedTripContainer error', error)
  
  var _data = {};
  if (!loading) {
    _data = data
  }
  const trip_status = get(_data, 'trip_status', [])
  const trips = get(_data,'customer[0].trips',[])
  const customerData = get(_data,'customer[0]',[])
  const record_count = get(_data, 'rows.aggregate.count', 0)

  console.log('trip_status',trip_status)

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusName: value })
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
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value, })
  }

  return (
    <Trip
      cardcode={cardcode}
      trips={trips}
      loading={loading}
      record_count={record_count}
      onPageChange={onPageChange}
      onPartnerNameSearch={onPartnerNameSearch}
      onCustomerNameSearch={onCustomerNameSearch}
      onSourceNameSearch={onSourceNameSearch}
      onDestinationNameSearch={onDestinationNameSearch}
      onTruckNoSearch={onTruckNoSearch}
      filter={filter}
      trip_status_list={trip_status}
      onTripIdSearch={onTripIdSearch}
      onFilter={onFilter}
    />
  )
}
export default ClosedTripContainer 