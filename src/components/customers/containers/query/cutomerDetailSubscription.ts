import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardCode: String) {
    customer(where: {cardCode: {_eq: $cardCode}}) {
      id
      cardCode
      name
      PAN
      GSTNo
      virtualAccount
      mobileNo
      managed
      advancePercentageId
      exceptionDate
      creditLimit
      onboardedById
      paymentManagerId
      statusId
      typeId
    }
  }
`
