import { gql } from '@apollo/client'

const DASHBOAD_QUERY = gql`
subscription dashboard_aggregate($now: timestamp, $regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $managers: [Int!]) {
  region(where: {id: {_in: $regions}}) {
    id
    branches(where:{id:{_in:$branches}}) {
      id
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        cities {
          id
          unloading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          assigned: trips_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          confirmed: trips_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          loading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          intransit: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          intransit_d: tripsByDestination_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          unloading_d: tripsByDestination_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          excess: trips_aggregate(where: {trip_status: {name: {_eq: "Waiting for truck"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          hold: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit halting"}}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
            aggregate {
              count
            }
          }
          trucks_total: trucks_aggregate(where: {
            _and: [
                {truck_status: {name: {_eq: "Waiting for Load"}}}, 
                {partner:{partner_status:{name:{_eq:"Active"}}}}
              ],
            _or:[{ partner:{dnd:{_neq:true}}}, {truck_type: {id:{_nin: [25,27]}}}]
          }) {
            aggregate {
              count
            }
          }
          trucks_current: trucks_aggregate(where: {
            _and: [
                {available_at: {_gte: $now}},
                {truck_status: {name: {_eq: "Waiting for Load"}}}, 
                {partner:{partner_status:{name:{_eq:"Active"}}}}
              ],
            _or:[{ partner:{dnd:{_neq:true}}}, {truck_type: {id:{_nin: [25,27]}}}]
            }) {
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
