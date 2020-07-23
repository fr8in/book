import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String) {
    customer(where: {cardcode: {_eq: $cardcode}}) {
      id
      cardcode
      name
      pan
      gst
      virtual_account
      mobile
      managed
      advance_percentage_id
      exception_date
      credit_limit
      onboarded_by_id
      payment_manager_id
      status_id
      type_id
    }
  }
`
