import { gql } from '@apollo/client'

export const TRUCKS_QUERY = gql`
  query trucks($offset: Int!, $limit: Int!) {
    truck(offset: $offset, limit: $limit) {
      truck_no
      trips{
        id
      }
      city{
        name
      }
      
      partner{
        cardcode
        name
      }
      driver{
        mobile_no
      }
      truck_status{
        value
      }
    }
  }
      
`