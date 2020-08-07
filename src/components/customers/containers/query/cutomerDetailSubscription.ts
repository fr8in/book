import { gql } from '@apollo/client';

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String) {
    customer(where: { cardcode: { _eq: $cardcode } }) {
      id
      cardcode
      name
      mobile
      approved_by_id
      exception_date
      gst
      managed
      pan
      customer_type_id
      virtual_account
      status {
        id
        name
      }
      onboardedBy {
        id
        email
      }
      paymentManager {
        id
        email
      }
      customer_type {
        id
        name
      }
      customer_users {
        name
        mobile
        email
      }
      customerBranches {
        branch_name
        name
        address
        state {
          name
        }
        pincode
        mobile
      }
    }
  }
`
