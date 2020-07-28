
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION = gql`
mutation customerPaymentManager($payment_manager_id:Int,$cardcode:String) {
  update_customer(_set: {payment_manager_id: $payment_manager_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      payment_manager_id
    }
  }
}
`
