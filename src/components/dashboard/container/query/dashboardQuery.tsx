import { gql } from '@apollo/client'

const DASHBOAD_QUERY = gql`
query dashboard_trips($now: timestamp,$regions: [Int!], $branches: [Int!], $cities: [Int!], $truck_type: [Int!], $managers: [Int!]) {
  unloading: trip_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  assigned: trip_aggregate(where: {trip_status: {name: {_eq: "Assigned"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  confirmed: trip_aggregate(where: {trip_status: {name: {_eq: "Confirmed"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  loading: trip_aggregate(where: {trip_status: {name: {_eq: "Reported at source"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  intransit: trip_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  intransit_d: trip_aggregate(where: {trip_status: {name: {_eq: "Intransit"}}, branch: {region_id: {_in: $regions}}, destination_branch_id: {_in: $branches}, destination_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  unloading_d: trip_aggregate(where: {trip_status: {name: {_eq: "Reported at destination"}}, branch: {region_id: {_in: $regions}}, destination_branch_id: {_in: $branches}, destination_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  excess: trip_aggregate(where: {trip_status: {name: {_eq: "Waiting for truck"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  hold: trip_aggregate(where: {trip_status: {name: {_eq: "Intransit halting"}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  adv_pending: trip_aggregate(where: {source_out: {_gt: $now}, trip_status: {name: {_nin: ["Cancelled"]}}, trip_accounting: {receipt: {_is_null: true}}, branch: {region_id: {_in: $regions}}, branch_id: {_in: $branches}, source_connected_city_id: {_in: $cities}, truck_type_id: {_in: $truck_type}, branch_employee_id: {_in: $managers}}) {
    aggregate {
      count
    }
  }
  trucks_total: truck_aggregate(where: {
    _and: [
        {truck_status: {name: {_eq: "Waiting for Load"}}}, 
        {partner:{partner_status:{name:{_eq:"Active"}}}},
      {city:{connected_city:{branch_id:{_in:$branches}}}}
      ],
    _or:[{ partner:{dnd:{_neq:true}}}, {truck_type: {id:{_nin: [25,27]}}}]
  }) {
    aggregate {
      count
    }
  }
  trucks_current: truck_aggregate(where: {
    _and: [
        {available_at: {_gte: $now}},
        {truck_status: {name: {_eq: "Waiting for Load"}}}, 
        {partner:{partner_status:{name:{_eq:"Active"}}}},
      {city:{connected_city:{branch_id:{_in:$branches}}}}
      ],
    _or:[{ partner:{dnd:{_neq:true}}}, {truck_type: {id:{_nin: [25,27]}}}]
    }) {
    aggregate {
      count
    }
  }
}`

export default DASHBOAD_QUERY
