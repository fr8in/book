import { gql } from '@apollo/client'

export const UPDATE_PARTNER_PAN_MUTATION = gql`
mutation PartnerPanEdit($pan:String,$cardcode:String) {
  update_partner(_set: {pan: $pan}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      pan
    }
  }
}
`