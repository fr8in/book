import { gql } from '@apollo/client'

export const UPDATE_TRUCK_TRUCKTYPE_MUTATION = gql`
mutation TRUCKTRUCKTYPEEdit($truck_type_id:Int,$truck_no:String) 
  {
    update_truck(_set:{truck_type_id: 1}, where:{truck_no: {_eq:"TN03SA0003"}}) {
      returning{
        id
        truck_type_id
      }
    }
  }

`
