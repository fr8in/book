import { gql } from '@apollo/client'

export const TRIPS_QUERY = gql`
  query trips($offset: Int!, $limit: Int!){
        trip(offset: 0, limit: 10) {
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
          partner_price
          customer_price
          km
        }
      }
`