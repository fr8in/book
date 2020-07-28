
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_MANAGED_MUTATION = gql`
mutation customerManaged($managed:Boolean,$cardcode:String) {
  update_customer(_set: {managed: $managed}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      managed
    }
  }
}
`
