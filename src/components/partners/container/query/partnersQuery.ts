import { gql } from '@apollo/client'

export const PARTNERS_QUERY = gql`
  query partners($offset: Int!, $limit: Int!) {
    partner(offset: $offset, limit: $limit) {
      id
      name
      cardcode
      pan
      onboarded_by{
        id
        name
      }
      created_at
      partner_status{
        value
      }
      city {
        branch {
          region {
            name
          }
        }
      }
      partner_status{
       value
      } 
      partner_users(limit:1 , where:{is_admin:{_eq:true}}){
        mobile
      }
      partner_comments(limit:1,order_by:{created_at:desc}){
        partner_id
        description
        created_at
        created_by
      }
      trucks_aggregate(where:{truck_status_id:{_neq:7}}){
        aggregate{
          count
        }
      }
    }
}
`
