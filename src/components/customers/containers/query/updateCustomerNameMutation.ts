
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_NAME_MUTATION = gql`
mutation CustomerNameEdit($name:String,$cardCode:String) {
  update_customer(_set: {name: $name}, where: {cardCode: {_eq: $cardCode}}) {
    returning {
      id
      name
    }
  }
}
`
