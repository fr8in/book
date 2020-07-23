import { gql } from '@apollo/client'

export const TRUCKS_QUERY = gql`
  query trucks($offset: Int!, $limit: Int!) {
    truck(offset: $offset, limit: $limit) {
          id
          truck_no
          city {
            id
            name
            partners {
              cardcode
              name
            }
            trips {
              id
            }
          }
          
        }
      }
       
      
`