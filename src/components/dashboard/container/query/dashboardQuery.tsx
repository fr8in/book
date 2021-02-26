import { gql } from '@apollo/client'

const DASHBOAD_QUERY = gql`
query dashboard_trips($now: timestamp,$regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $managers: [Int!],$yearStart:timestamp,$dnd: Boolean,$speed: [Int!]) {
  unloading: trip_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers} , partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  assigned: trip_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  confirmed: trip_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  loading: trip_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  intransit: trip_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  intransit_d: trip_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, branch: {region_id: {_in: $regions}}, destination_branch_id: {_in: $branches}, destination_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  unloading_d: trip_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, branch: {region_id: {_in: $regions}}, destination_branch_id: {_in: $branches}, destination_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  excess: trip_aggregate(where: {trip_status: {name: {_eq: "Waiting for truck"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}) {
    aggregate {
      count
    }
  }
  hold: trip_aggregate(where: {trip_status: {name: {_eq: "Intransit halting"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  adv_pending: trip_aggregate(where: {trip_status: {name: {_nin: ["Waiting for truck","Assigned","Confirmed","Cancelled","Closed","Recieved"]}}, trip_accounting: {receipt_ratio: {_lt: 0.5}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}, partner: {avg_km_speed_category_id : {_in: $speed}}}) {
    aggregate {
      count
    }
  }
  trucks_total: truck_aggregate(where: {
    _and: [
        {truck_status: {name: {_eq: "Waiting for Load"}}}, 
        {partner:{avg_km_speed_category_id : {_in: $speed},partner_status:{name:{_eq:"Active"}}}},
        {truck_type_id: {_in: $truck_type}},
      {city:{connected_city:{branch_id:{_in:$branches}}}},
      {dnd:{_neq:$dnd}}]
  }) {
    aggregate {
      count
    }
  }
  trucks_current: truck_aggregate(where: {
    _and: [
        {available_at: {_lte: $now}},
        {truck_status: {name: {_eq: "Waiting for Load"}}}, 
        {partner:{avg_km_speed_category_id : {_in: $speed},partner_status:{name:{_eq:"Active"}}}},
        {truck_type_id: {_in: $truck_type}},
      {city:{connected_city:{branch_id:{_in:$branches}}}},
     {dnd:{_neq:$dnd}}
    ]
    }) {
    aggregate {
      count
    }
  }
}`

export default DASHBOAD_QUERY

