import { gql } from '@apollo/client'

export const PARTNER_USERS_QUERY = gql`
  query partnerUser($cardcode: String){
        partner(where:{cardcode:{_eq:$cardcode}}){
          partner_users{
            is_admin
            mobile
            name
          }
        }
  }
`
