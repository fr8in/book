import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
  query trips($offset: Int!, $limit: Int!){
    trip(offset: $offset, limit: $limit) {
      id
      order_date
      customer {
        name
      } 
      partner {
        name
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
        value
      }
      km    
      tat
      trip_comments(limit: 5, order_by: {created_at: desc}) {
        description
        created_by
        created_at
      }
    }
  }  
  `