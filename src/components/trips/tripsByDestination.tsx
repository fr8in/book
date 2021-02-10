import React from 'react'
import Trips from './activeTrips'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import { useState,useContext } from 'react'
import {filterContext} from '../../context'

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
    }
    partner {
      id
      cardcode
      name
      partner_users(where: {is_admin: {_eq: true}}) {
        mobile
      }
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
        code
      }
    }
  }
}
`
const TripsByDestination = (props) => {
  const {  trip_status, intransit } = props
  const {state} = useContext(filterContext)

  const variables = {
    regions: (state.regions && state.regions.length > 0) ? state.regions : null,
    branches: (state.branches && state.branches.length > 0) ? state.branches : null,
    cities: (state.cities && state.cities.length > 0) ? state.cities : null,
    truck_type: (state.types && state.types.length > 0) ? state.types : null,
    managers: (state.managers && state.managers.length > 0) ? state.managers : null,
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
