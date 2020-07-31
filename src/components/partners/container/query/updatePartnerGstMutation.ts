import { gql } from '@apollo/client'

export const UPDATE_PARTNER_GST_MUTATION = gql`
mutation PartnerGstEdit($gst:String,$cardcode:String) {
  update_partner(_set: {gst: $gst}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`