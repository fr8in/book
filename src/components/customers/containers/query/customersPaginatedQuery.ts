import { gql } from '@apollo/client'

export const CUSTOMERS_PAGINATED_QUERY = gql`
  query customers($first: Int!, $cursor: String, $statusId:[Int!]) {
  customer_connection(
    after: $cursor,
    first: $first,
    where: {status:{id: {_in: $statusId }}}
  ) {
    edges {
      cursor
      node {
        id
        cardcode
        name
        mobile
        type_id
        pan
        created_at
        customerUsers{
          id
          name
        }
        advancePercentage{
          id
          value
        }
        status{
          id
          value
        }
      }
    }
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
  }
}
`
