import { gql } from '@apollo/client'

export const UPDATE_PARTNER_NAME_MUTATION = gql`
mutation PartnerNameEdit($name:String,$cardcode:String) {
  update_partner(_set: {name: $name}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      name
    }
  }
}
`
