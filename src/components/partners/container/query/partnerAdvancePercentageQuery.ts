import { gql } from '@apollo/client'

export const PARTNER_ADVANCE_PERCENTAGE_QUERY = gql`
  query partnerAdvancePercentage{
   partner_advance_percentage{
    id
    value
  }
}
`