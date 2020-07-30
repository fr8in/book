import { gql } from '@apollo/client'

export const UPDATE_PARTNER_BANK_MUTATION = gql`
mutation PartnerBankEdit($bank_id:Int,$cardcode:String) {
  update_partner(_set: {bank_id: $bank_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      bank_id
    }
  }
}
`