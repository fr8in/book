import { gql } from '@apollo/client'

const DASHBOAD_TRIPS_QUERY = gql`
subscription dashboard_trips(
  $trip_status: String!,
  $regions: [Int!], 
  $branches: [Int!], 
  $cities: [Int!], 
  $truck_type: [Int!], 
  $managers: [Int!]
  ) {
  trip(where:{
    trip_status:{name:{_eq:$trip_status}},
    branch:{region_id:{_in:$regions}},
    branch_id:{_in:$branches},
    source_connected_city_id:{_in:$cities},
    truck_type_id:{_in:$truck_type},
    branch_employee_id:{_in: $managers}
  }) {
    id
    source_connected_city_id
    branch_id
    branch {
      region_id
    }
    destination_branch_id
    delay
    eta
    loaded
    customer {
      id
      cardcode
      name
      is_exception
    }
    partner {
      id
       partner_users(where: {is_admin: {_eq: true}}) {
                mobile
              }
      cardcode
      name
    }
    source {
      id
      name
    }
    destination {
      id
      name
    }
    trip_status {
      id
      name
    }
    confirmed_tat
    loading_tat
    intransit_tat
    unloading_tat
    driver{
      id
      mobile
    }
    last_comment {
      description
      id
    }
    truck {
      truck_no
      truck_type {
        name
        code
      }
    }
  }
}`

export default DASHBOAD_TRIPS_QUERY
