import { gql } from '@apollo/client'

export const TRIP_DETAIL_SUBSCRIPTION = gql`
  subscription trips($id: Int) {
    trip(where: {id:{_eq:$id}}){
      id
      order_date
      customer_price
      to_pay
      mamul
      partner_price
      including_loading
      including_unloading
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
      to_pay_comment
      to_pay_confirmation
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
`