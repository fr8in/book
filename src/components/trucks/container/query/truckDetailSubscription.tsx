import { gql } from '@apollo/client'

export const TRUCK_DETAIL_SUBSCRIPTION = gql`
  subscription trucks($truck_no: String) {
    truck(where: {truck_no: {_eq: $truck_no}}) {
        truck_no
        truck_type{
          value
        }
        city{
          name
        }
        
        partner{
          cardcode
          name
        }
        driver{
          mobile_no
        }
        
      }
    }
`
