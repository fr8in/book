import { gql } from '@apollo/client'

const DASHBOAD_QUERY = gql`
subscription dashboard_aggregate($now: timestamptz, $regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $managers: [Int!]) {
  region(where: {id: {_in: $regions}}) {
    id
    branches(where:{id:{_in:$branches}}) {
      id
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        cities {
          id
          unloading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          assigned: trips_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          confirmed: trips_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          loading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          intransit: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          intransit_d: tripsByDestination_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          unloading_d: tripsByDestination_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          excess: trips_aggregate(where: {trip_status: {name: {_eq: "Waiting for truck"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          hold: trips_aggregate(where: {trip_status: {name: {_eq: "Delivery onhold"}}, truck_type_id: {_in: $truck_type}, created_by: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          trucks_total: trucks_aggregate(where: {truck_status: {name: {_eq: "Waiting for Load"}}}) {
            aggregate {
              count
            }
          }
          trucks_current: trucks_aggregate(where: {_and: [{truck_status: {name: {_eq: "Waiting for Load"}}}, {available_at: {_gte: $now}}]}) {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
}
`
export default DASHBOAD_QUERY
