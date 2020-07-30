import { gql } from '@apollo/client'

export const UPDATE_TRIP_SOURCEIN_MUTATION = gql`
mutation tripSourceIn($Source_in:date,$id:Int) {
    update_trip(_set: {source_in:$source_in}, where: {id:{_eq:$id}}) {
      returning {
        id
        source_in
      }
    }
  }
` 