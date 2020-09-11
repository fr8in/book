import { gql } from '@apollo/client'

export const APPROVALS_QUERY = gql`
query trip_credit_debit($status:[String!],$offset:Int,$limit:Int){
    trip_credit_debit(where: {credit_debit_status: {name: {_in:$status}}}, order_by: {trip_id: desc},offset:$offset,limit:$limit){
      id
      trip_id
      type
      amount
      approval_comment
     approved_amount
     approved_by
      credit_debit_status {
        id
        name
      }
      trip {
        trip_comments(order_by: {id: desc}, limit: 1) {
          id
          description
        }
        branch {
          region {
            name
          }
        }
      }
      responsibility {
        id
        name
      }
      comment
      credit_debit_type {
        name
      }
      created_at
      created_by
    }
  }
`