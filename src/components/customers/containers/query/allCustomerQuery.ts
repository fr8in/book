import gql from 'graphql-tag'

export const ALL_CUSTOMER_QUERY = gql`
  query customers($offset: Int!, $limit: Int!) {
    customer(offset: $offset, limit: $limit) {
      id
      name
      mobileNo
      cardCode
    }
  }
`
