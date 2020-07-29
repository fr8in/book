import { gql } from '@apollo/client'

export const INSERT_TRIP_COMMENT_MUTATION = gql`
mutation TripComment($description:String, $topic:String, $trip_id: Int, $created_by:String ) {
  insert_trip_comment(objects: {description: $description, trip_id: $trip_id, topic: $topic, created_by: $"babu@f8.in"}) {
    returning {
      description
      trip_id
    }
  }
}
`