import { gql } from '@apollo/client'

const DASHBOAD_TRIPS_QUERY = gql`
subscription dashboard_trips($regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $managers: [Int!], $trip_status: String) {
  region(where: {id: {_in: $regions}}) {
    id
    branches(where:{_and: [ {region_id:{_in:$regions}} {id:{_in:$branches}}]}) {
      id
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        cities {
          id
          trips(where: {trip_status: {name: {_eq: $trip_status}}, truck_type: {id: {_in: $truck_type}}, created_by: {_in: $managers}}) {
            id
            delay
            eta
            customer {
              id
              cardcode
              name
            }
            partner {
              id
              cardcode
              name
              partner_users(where: {is_admin: {_eq: true}}) {
                mobile
              }
            }
            driver
            source {
              id
              name
            }
            destination {
              id
              name
            }
            tat
            trip_comments(limit: 1, order_by: {created_at: desc}) {
              id
              description
            }
            truck {
              truck_no
              truck_type {
                name
              }
              driver {
                mobile
              }
            }
          }
        }
      }
    }
  }
}
`
export default DASHBOAD_TRIPS_QUERY
