import { gql } from '@apollo/client'

export const PARTNER_BANK_QUERY = gql`
  query partnerBank{
  bank{
      id
    name
  }
}
`