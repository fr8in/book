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
          trips(where: {trip_status: {name: {_eq: $trip_status}}, truck_type: {id: {_in: $truck_type}}, branch_employee_id: {_in: $managers}}) {
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
            source {
              id
              name
            }
            destination {
              id
              name
            }
            trip_status{
              id
              name
            }
            confirmed_tat
            loading_tat
            intransit_tat
            unloading_tat
            last_comment{
              description
              id
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
