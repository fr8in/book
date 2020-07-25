import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String) {
    customer(where: {cardcode: {_eq: $cardcode}}) {
      id
      cardcode
      name
      mobile
      credit_limit
      advance_percentage_id
      approved_by_id
      created_at
      exception_date
      gst
      managed
      pan
      type_id
      updated_at
      virtual_account
      walletcode
      status {
        id
        value
      }
      onboardedBy {
        id
        email
      }
      paymentManager {
        id
        email
      }
      type {
        comment
        value
      }      
    }
  }
`
