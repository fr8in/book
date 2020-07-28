
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_EXCEPTION_MUTATION = gql`
mutation customerException($exception_date:String,$cardcode:String) {
  update_customer(_set: {exception_date: $exception_date}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      managed
    }
  }
}
`
