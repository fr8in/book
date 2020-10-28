import { gql } from '@apollo/client'

const DASHBOAD_QUERY = gql`
subscription dashboard_trips($now: timestamp,$regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $managers: [Int!]) {
  city {
    unloading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    assigned: trips_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    confirmed: trips_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    loading: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    intransit: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    intransit_d: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, branch: {region_id: {_in: $regions}}, destination_branch_id: {_in: $branches}, destination_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    unloading_d: trips_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, branch: {region_id: {_in: $regions}}, destination_branch_id: {_in: $branches}, destination_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    excess: trips_aggregate(where: {trip_status: {name: {_eq: "Waiting for truck"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
      aggregate {
        count
      }
    }
    hold: trips_aggregate(where: {trip_status: {name: {_eq: "Intransit halting"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
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
}`

export default DASHBOAD_QUERY
