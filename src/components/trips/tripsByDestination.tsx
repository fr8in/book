import React from 'react'
import Trips from './activeTrips'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const TRIPS_QUERY = gql`
subscription dashboard_trips(
  $trip_status: String!,
  $regions: [Int!], 
  $branches: [Int!], 
  $cities: [Int!], 
  $truck_type: [Int!], 
  $managers: [Int!]
  ) {
  trip(where:{
    trip_status:{name:{_eq:$trip_status}},
    branch:{region_id:{_in:$regions}},
    destination_branch_id:{_in:$branches},
    destination_connected_city_id:{_in:$cities},
    truck_type_id:{_in:$truck_type},
    branch_employee_id:{_in: $managers}
  }) {
    id
    source_connected_city_id
    branch_id
    branch {
      region_id
    }
    destination_branch_id
    delay
    eta
    loaded
    customer {
      id
      cardcode
      name
      is_exception
      exception_date
    }
    partner {
      id
      cardcode
      name
    }
    source {
      id
      name
    }
    destination {
      id
      name
    }
    trip_status {
      id
      name
    }
    confirmed_tat
    loading_tat
    intransit_tat
    unloading_tat
    driver{
      id
      mobile
    }
    last_comment {
      description
      id
    }
    truck {
      truck_no
      truck_type {
        name
      }
    }
  }
}
`
const TripsByDestination = (props) => {
  const { filters, trip_status, intransit } = props

  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers.length > 0) ? filters.managers : null,
    trip_status: trip_status
  }

  const { loading, error, data } = useSubscription(
    TRIPS_QUERY,
    { variables: variables }
  )
  console.log('TripsByDestination error', error)

  let newData = {}
  if (!loading) {
    newData = data
  }

  const trips = get(newData, 'trip', [])

  return (
    <Trips trips={trips} loading={loading} intransit={intransit} />
  )
}

export default TripsByDestination
