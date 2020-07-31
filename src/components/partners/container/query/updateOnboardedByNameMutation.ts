import { gql } from '@apollo/client'

export const UPDATE_PARTNER_ONBOARDED_BY_NAME_MUTATION = gql`
mutation partner_onboarded_by_name($onboarded_by_id:Int,$cardcode:String) {
    update_partner(_set:{onboarded_by_id: $onboarded_by_id}, where:{cardcode: {_eq:$cardcode}}){
        returning{
          id
          onboarded_by_id   
        }
  }
}
`