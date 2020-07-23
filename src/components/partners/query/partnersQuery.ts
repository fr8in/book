import { gql } from '@apollo/client'

export const PARTNERS_QUERY = gql`
  query partners($offset: Int!, $limit: Int!) {
    partner(offset: $offset, limit: $limit) {
      id
      name
      cardcode
    }
    region{
      id
      name
    }
  }
`