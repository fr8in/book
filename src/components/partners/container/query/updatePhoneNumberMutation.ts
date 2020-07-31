import { gql } from '@apollo/client'

export const UPDATE_PARTNER_NUMBER_MUTATION = gql`
mutation PartnerNumberEdit($mobile:String,$id:Int) {
    update_partner_user(_set: {mobile: $mobile}, where: {is_admin: {_eq: true}, id: {_eq: 2}}) {
      returning {
        id
        mobile
      }
    }
  }
`