import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
query trips{
  trip_status {
    id
    name
  }
}  
`
export const TRIPS = gql`
subscription trips(
  $offset: Int!, 
  $limit: Int!,
  $where: trip_bool_exp){
  trip(offset: $offset, limit: $limit, where:$where)
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
    last_comment{
      description
      created_at
      created_by
     }
  }
}  
`