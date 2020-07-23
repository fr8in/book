import { gql } from '@apollo/client'

export const CUSTOMERS_QUERY = gql`
  query customers($offset: Int!, $limit: Int!) {
    customer(offset: $offset, limit: $limit) {
      id
      name
      mobileNo
      cardCode
      creditLimit
      status {
        id
      }
    }
  }
`
