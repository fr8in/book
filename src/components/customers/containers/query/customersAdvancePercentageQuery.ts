import { gql } from '@apollo/client'

export const CUSTOMERS_ADVANCE_PERCENTAGE_QUERY = gql`
  query customerAdvancePercentage{
  customer_advance_percentage{
    id
    value
  }
}
`
