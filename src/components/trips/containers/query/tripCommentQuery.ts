import { gql } from '@apollo/client'

export const TRIP_COMMENT_QUERY = gql`
  query tripComment($id: Int!){
    trip(where:{id:{_eq:$id}}) {
      trip_comments(limit:5,order_by:{created_at:desc}){
        id
        description
        created_at
        created_by
      }
    }
  }
`