
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_ADVANCE_MUTATION = gql`
mutation CustomerAdvaceUpdate($advance_percentage_id:Int,$cardcode:String) {
  update_customer(_set: {advance_percentage_id: $advance_percentage_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      advance_percentage_id
    }
  }
}
`
