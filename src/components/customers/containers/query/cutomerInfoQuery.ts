import gql from 'graphql-tag'

export const CUSTOMER_INFO_QUERY = gql`
  query customers($cardCode: String) {
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
