import { useState } from 'react'
import PaidStatus from '../../trips/tripsByStages'
import u from '../../../lib/util'
import get from 'lodash/get'

import { gql, useQuery } from '@apollo/client'

const PAID_QUERY = gql`
query paid_trip($offset: Int, $limit: Int,$trip_status_value:[String!], $cardcode: String){
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
      truck{
        truck_no
        truck_type{
          name
        }
      }
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
}`

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

  const { loading, error, data } = useQuery(
    PAID_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('PaidContainer error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const trips = get(_data, 'partner[0].trips', [])
  const record_count = get(_data, 'partner[0].trips_aggregate.aggregate.count', 0)

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }

  return (
    <PaidStatus
      cardcode={cardcode}
      trips={trips}
      loading={loading}
      record_count={record_count}
      filter={filter}
      onPageChange={onPageChange}
      partnerPage
    />
  )
}

export default PaidContainer
