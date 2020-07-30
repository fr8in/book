import { gql } from '@apollo/client'

export const UPDATE_TRUCK_TYPE_MUTATION = gql`
mutation TruckTypeEdit($truck_type_id:Int,$truck_no:String) 
  {
    update_truck(_set:{truck_type_id: $truck_type_id}, where:{truck_no: {_eq:$truck_no}}) {
      returning{
        id
        truck_type_id
      }
    }
  }

`
