import { gql } from '@apollo/client'

export const UPDATE_PARTNER_ADVANCE_PERCENTAGE_MUTATION = gql`
mutation partnerAdvancePercentage($partner_advance_percentage_id:Int,$cardcode:String) {
  update_partner(_set:{partner_advance_percentage_id:$partner_advance_percentage_id }, where:{cardcode:{_eq:$cardcode}}){
    returning{
      id
      partner_advance_percentage_id
    }
  }
  
}
`