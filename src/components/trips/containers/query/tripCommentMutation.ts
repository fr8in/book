import { gql } from '@apollo/client'

export const INSERT_TRIP_COMMENT_MUTATION = gql`
mutation TripComments($description:String, $topic:String, $trip_id: Int, $created_by:String ) {
  insert_trip_comment(objects: {description: $description, trip_id: $trip_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
      trip_id
    }
  }
}
`