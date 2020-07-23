
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_NAME_MUTATION = gql`
mutation CustomerNameEdit($name:String,$cardcode:String) {
  update_customer(_set: {name: $name}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      name
    }
  }
}
`
