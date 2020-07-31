import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
  query trips($offset: Int!, $limit: Int!){
    trip(offset: $offset, limit: $limit) {
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
        value
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
