import { gql } from '@apollo/client'

export const UPDATE_CIBIL_SCORE_MUTATION = gql`
mutation PartnerCibilScoreEdit($cibil:Int,$cardcode:String) {
  update_partner(_set: {cibil: $cibil}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      cibil
    }
  }
}
`