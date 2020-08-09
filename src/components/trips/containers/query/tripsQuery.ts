import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
query trips(
  $offset: Int!, 
  $limit: Int!,
  $id:[Int!], 
  $trip_statusName: [String!],
  $name: String, 
  $customername:String,
  $sourcename:String,
  $destinationname:String,
  $truckno:String,
  $where: trip_bool_exp,
  $all_trip: trip_bool_exp,
  $delivered_trip: trip_bool_exp,
  $pod_verified_trip: trip_bool_exp,
  $invoiced_trip: trip_bool_exp){
  trip_count: trip_aggregate(where: $all_trip) {
    aggregate {
      count
    }
  }
  delivered: trip_aggregate(where: $delivered_trip) {
    aggregate {
      count
    }
  }
  pod_verified: trip_aggregate(where:$pod_verified_trip ) {
    aggregate {
      count
    }
  }
  invoiced: trip_aggregate(where: $invoiced_trip) {
    aggregate {
      count
    }
  }
  rows: trip_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  trip_status(where: {name: {_in: $trip_statusName}}, order_by: {id: asc}) {
    id
    name
  }
  trip(offset: $offset, limit: $limit, where:$where, order_by: { order_date: desc })
    {
    id
    order_date
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
    trip_status{
      name
    }
    km    
    tat
    trip_comments(limit:1, order_by: {created_at: desc}) {
      description
      created_by
      created_at
    }
    trip_prices(limit:1, where:{deleted_at:{_is_null:true}})
    {
      id
      customer_price
      partner_price
    }
  }
}  
`
