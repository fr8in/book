import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
query trips(
  $offset: Int!, 
  $limit: Int!,
  $trip_statusName: [String!],
  $where: trip_bool_exp){
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
    trip_prices{
      customer_price
      partner_price
    }
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
    # trip_comments(limit:1, order_by: {created_at: desc}) {
    #   description
    #   created_by
    #   created_at
    # }
  }
}  
`
