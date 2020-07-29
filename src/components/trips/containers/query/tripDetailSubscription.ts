import { gql } from '@apollo/client'

export const TRIP_DETAIL_SUBSCRIPTION = gql`
  subscription trips($id: Int) {
    trip(where: {id:{_eq:$id}}){
      id
      order_date
      customer{
        name
      }
      partner{
        name
      }
      truck{
        truck_no
        truck_type{
          value
        }
      }
      source_in
      status_at
      destination_in
      destination_out
       source{
        name
      }
      destination{
        name
      }
      trip_prices{
        to_pay
        mamul
        cash
        customer_price
        partner_price
      }  
    }
  }
`