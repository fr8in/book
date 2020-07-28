import { gql } from '@apollo/client'

export const PARTNERS_QUERY = gql`
  query partners($offset: Int!, $limit: Int!) {
    partner(offset: $offset, limit: $limit) {
      id
      name
      cardcode
      pan
      onboarded_by{
        id
        name
      }
      partner_status{
       value
      } 
      partner_comments{
        partner_id
        description
        created_at
        created_by
      }
    }
}
`