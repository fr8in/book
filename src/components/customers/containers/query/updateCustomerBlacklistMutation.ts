
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`
mutation customerBlacklist($statusId:Int,$cardCode:String) {
  update_customer(_set: {statusId: $statusId}, where: {cardCode: {_eq: $cardCode}}) {
    returning {
      id
      statusId
    }
  }
}
`
