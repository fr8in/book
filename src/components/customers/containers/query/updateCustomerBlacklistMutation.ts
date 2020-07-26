
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`
mutation customerBlacklist($status_id:Int,$cardcode:String) {
  update_customer(_set: {status_id: $status_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      status_id
    }
  }
}
`
