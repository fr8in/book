import { gql } from '@apollo/client'

export const INSERT_PARTNER_USERS_MUTATION = gql`

mutation PartneruserInsert($name:String,$is_admin:Boolean,$mobile:String,$email:String,$partner_id:Int) {
    insert_partner_user(
      objects: {
        name: $name,
  is_admin: $is_admin,
  mobile: $mobile,
  email:$email,
  partner_id: $partner_id
      }
    ) {
      returning {
        partner_id
        mobile
      }
    }
      }
`
