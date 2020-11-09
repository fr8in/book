import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
query trips_list_status_filter($trip_statusName:[String!], $where: trip_bool_exp){
  trip_status (where: {name: {_in: $trip_statusName}}){
    id
    name
  }
  rows: trip_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}  
`
export const TRIPS = gql`
query trips_status($offset: Int!, $limit: Int!, $where: trip_bool_exp, $date_sort: order_by) {
  trip(offset: $offset, limit: $limit, where: $where, order_by: {created_at: $date_sort}) {
    id
    order_date
    po_date
    created_at
    customer {
      name
      cardcode
    }
    partner {
      name
      cardcode
    }
    truck {
      truck_no
    }
    source {
      name
    }
    destination {
      name
    }
    trip_status {
      name
    }
    km
    pod_verified_at
    pod_dispatched_at
    delivered_tat
    pod_verified_tat
    pod_dispatched_tat
    invoiced_tat
    paid_tat
    received_tat
    closed_tat
    last_comment {
      description
      created_at
      created_by
    }
  }
}
`
