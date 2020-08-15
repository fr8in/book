import React from 'react'
import Trips from './activeTrips'
import { gql, useSubscription } from '@apollo/client'
import _ from 'lodash'

const TRIPS_QUERY = gql`
subscription dashboard_trips_truks($regions: [Int!], $trip_status:String!, $branches: [Int!], $cities: [Int!] ) {
  region(where: {id: {_in: $regions}}) {
    id
    name
    branches(where: {id: {_in: $branches}}) {
      branch_employees {
        id
        employee {
          id
          name
        }
      }
      id
      name
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        name
        cities {
          id
          name
          tripsByDestination(where: {trip_status: {name: {_eq: $trip_status}}}) {
            id
            delay
            eta
            customer {
              cardcode
              name
            }
            partner {
              cardcode
              name
              partner_users(where: {is_admin: {_eq: true}}) {
                mobile
              }
            }
            driver
            truck {
              truck_no
              truck_type {
                name
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
            tat
          }
        }
      }
    }
  }
}
`
const TripsByDestination = (props) => {
  const { filters, trip_status, intransit } = props

  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities > 0) ? filters.cities : null,
    trip_status: trip_status
  }

  const { loading, error, data } = useSubscription(
    TRIPS_QUERY,
    { variables: variables }
  )

  console.log('TripsByDestination error', error)

  let trips = []

  if (!loading) {
    const newData = { data }
    trips = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('tripsByDestination').value()
  }

  return (
    <Trips trips={trips} loading={loading} intransit={intransit ? intransit : ''} />
  )
}

export default TripsByDestination