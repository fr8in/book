
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_TYPE_MUTATION = gql`
mutation customerException($type_id:customer_type_enum,$cardcode:String) {
  update_customer(_set: {type_id: $type_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      type_id
    }
  }
}
`
