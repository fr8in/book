import { gql } from '@apollo/client'

export const CUSTOMERS_QUERY = gql`
  query customers($offset: Int!, $limit: Int!) {
    customer(offset: $offset, limit: $limit) {
      cardcode
      customerUsers{
        id
        name
      }
      name
      mobile
      type_id
      created_at
      pan
      advancePercentage{
        id
        value
      }
      status {
        id
        value
      }
    }
    customer_status{
      id
      value
    }
  }
`
