
import { gql } from '@apollo/client'

export const UPDATE_CUSTOMER_GST_MUTATION = gql`
mutation CustomerGstEdit($gst:String,$cardcode:String) {
  update_customer(_set: {gst: $gst}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
