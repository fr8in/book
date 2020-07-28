import { gql } from '@apollo/client'

export const PARTNER_COMMENT_QUERY = gql`
  query partnerComment($id: Int!){
    partner(where:{id:{_eq:$id}}) {
      partner_comments(limit:5,order_by:{created_at:desc}){
        id
        description
        created_at
        created_by
      }
    }
  }
`