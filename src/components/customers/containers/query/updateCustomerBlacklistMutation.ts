
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`
mutation customerBlacklist($statusId:Int,$cardcode:String) {
  update_customer(_set: {statusId: $statusId}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      status_id
    }
  }
}
`
