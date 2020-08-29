import { useState } from 'react'
import PaidStatus from '../../trips/tripsByStages'
import u from '../../../lib/util'

import { gql, useQuery } from '@apollo/client'

const PAID_QUERY = gql`
query partners($offset: Int, $limit: Int,$trip_status_value:[String!], $cardcode: String){
  partner( where: {cardcode: {_eq: $cardcode}}){
    id
    cardcode
    trips_aggregate(where: {trip_status: {name: {_in: $trip_status_value}}}) {
      aggregate {
        count
      }
    }
    trips(offset: $offset, limit: $limit, where: {trip_status: {name: {_in: $trip_status_value}}}) {
      id
      order_date
      source {
        name
      }
      destination {
        name
      }
      source_in
      trip_status {
        name
      }
    }
  }        
}
`
const paid = ['Paid', 'Closed']
const PaidContainer = (props) => {
  const initialFilter = {
    offset: 0,
    limit: u.limit
  }
  const [filter, setFilter] = useState(initialFilter)

  const { cardcode } = props
  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    cardcode: cardcode,
    trip_status_value: paid
  }
  console.log('variables', variables)
  const { loading, error, data } = useQuery(
    PAID_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('PaidContainer error', error)
  var trips = []
  var partnerData = []
  var trips_aggregate = 0
  if (!loading) {
    const { partner } = data
    partnerData = partner[0] ? partner[0] : { name: 'ID does not exist' }
    trips = data.partner[0] && data.partner[0].trips
    trips_aggregate = data && data.partnerData && data.partnerData.trips_aggregate
  }

  const record_count = partnerData && partnerData.trips_aggregate && partnerData.trips_aggregate.aggregate && partnerData.trips_aggregate.aggregate.count
  console.log('record_count', record_count)
  const total_page = Math.ceil(record_count / filter.limit)

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }
  return (
    <PaidStatus
      cardcode={cardcode}
      trips={trips}
      loading={loading}
      record_count={record_count}
      total_page={total_page}
      filter={filter}
      onPageChange={onPageChange}
    />
  )
}
export default PaidContainer
