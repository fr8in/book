import { gql } from '@apollo/client'

export const CUSTOMERS_TYPE_QUERY = gql`
  query customerType{
  customer_type{
    value
    comment
  }
}
`
