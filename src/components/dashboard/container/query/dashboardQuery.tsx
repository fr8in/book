import { gql } from '@apollo/client'
// dashboard_trips_truks
const DASHBOAD_QUERY = gql`
subscription dashboard_trips_truks($now: timestamptz,$regions: [Int!], $branches: [Int!], $cities: [Int!], $trip_status: String, $truck_type: [Int!], $managers: [Int!], $truckno: String ) {
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
          unloading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}}) {
            aggregate {
              count
            }
          }
          assigned: trips_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}}) {
            aggregate {
              count
            }
          }
          confirmed: trips_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}}) {
            aggregate {
              count
            }
          }
          loading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}}) {
            aggregate {
              count
            }
          }
          intransit: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}}) {
            aggregate {
              count
            }
          }
          intransit_d: tripsByDestination_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}}){
            aggregate{
              count
            }
          }
          unloading_d: tripsByDestination_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}}){
            aggregate{
              count
            }
          }
          excess: trips_aggregate(where: {trip_status: {name: {_eq: "Waiting for truck"}}}) {
            aggregate {
              count
            }
          }
          hold: trips_aggregate(where: {trip_status: {name: {_eq: "Delivery onhold"}}}) {
            aggregate {
              count
            }
          }
          trips(where: {trip_status: {name: {_eq: $trip_status}}, truck_type:{id: {_in:$truck_type}}, created_by: {_in: $managers}}) {
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
            trip_comments(limit: 1, order_by: {created_at: desc}) {
              description
            }
          }
          trucks_total: trucks_aggregate(where: {truck_status: {name: {_eq: "Waiting for load"}}}) {
            aggregate {
              count
            }
          }
          trucks_current: trucks_aggregate(where: {_and: [{truck_status: {name: {_eq: "Waiting for load"}}}, {available_at: {_gte: $now}}]}) {
            aggregate {
              count
            }
          }
          trucks(where:{
              truck_no: { _ilike: $truckno }
              truck_status: {name: {_in: ["Waiting for load"]}}}) {
            id
            truck_no
            truck_type {
              name
            }
            partner {
              id
              cardcode
              name
              partner_memberships {
                membership_type_id
              }
              partner_users(where: {is_admin: {_eq: true}}) {
                mobile
              }
            }
            tat
            city{
              id
              name
            }
            truck_comments(limit: 1, order_by: {created_at: desc}) {
              description
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
`
export default DASHBOAD_QUERY
