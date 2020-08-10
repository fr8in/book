import { gql } from '@apollo/client'
// dashboard_trips_truks
const DASHBOAD_QUERY = gql`
subscription dashboard_trips_truks($regions: [Int!], $branches: [Int!], $cities: [Int!], $where:trip_bool_exp ) {
  region {
    id
    name
    branches(where: {_and: [{region_id: {_in: $regions}}, {id: {_in: $branches}}]}) {
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
          unloading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, source: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          assigned: trips_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}, source: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          confirmed: trips_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}, source: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          loading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}, source: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          intransit: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, source: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          intransit_d: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, destination: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          unloading_d: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, destination: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          hold: trips_aggregate(where: {trip_status: {name: {_eq: "Delivery onhold"}}, source: {id: {_in: $cities}}}) {
            aggregate {
              count
            }
          }
          trips(where: $where) {
            id
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
            trip_comments(limit: 1, order_by: {created_at: desc}) {
              description
            }
          }
          trucks(where: {truck_status: {name: {_in: ["Waiting for load"]}}}) {
            id
            truck_no
            truck_type {
              name
            }
            partner {
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
