import { gql } from '@apollo/client'

export const TRUCK_DETAIL_SUBSCRIPTION = gql`
  subscription trucks($truck_no: String,$trip_status_id:[Int!]) {
    truck(where: {truck_no: {_eq: $truck_no}}) {
        truck_no
        truck_type{
          value
        }
        city{
          name
        }
        partner {
          name
          partner_users {
            id
            mobile
          }
          cardcode
        }
        trips (where: {trip_status_id: {_in: $trip_status_id}}) {
          id
          order_date
          source{
            name
          }
          destination{
            name
          }
          trip_status{
            value
          }
        }
        
      }
    }
`
