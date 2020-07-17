import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardCode: String) {
    customer(where: {cardCode: {_eq: $cardCode}}) {
      id
      PAN
      name
      mobileNo
      cardCode
      statusId
    }
  }
`
