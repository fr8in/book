
import { gql } from '@apollo/client'

export const UPDATE_TRUCK_NO_MUTATION = gql`
mutation TruckNoEdit($truck_no:String,$id:Int) {
  update_truck(_set: {truck_no: $truck_no}, where: {id: {_eq: $id}}) {
    returning {
      id
      truck_no
    }
  }
}
`
