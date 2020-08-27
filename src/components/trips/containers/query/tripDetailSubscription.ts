import { gql } from '@apollo/client'

export const TRIP_DETAIL_SUBSCRIPTION = gql`
  subscription trips($id: Int) {
    trip(where: {id:{_eq:$id}}){
      id
      order_date
      source_in
      source_out
      status_at
      destination_in
      destination_out
      driver
      delay
      eta
      po_date
      unloaded_private_godown
      lr
      customer_confirmation
      #trip_partner_payment{
       # amount
       # mode
       # date
      #}
      #trip_partner_charge{
      #  amount
      #  name   
      #}
      trip_comments{
        id
        description
        topic
        created_by
        created_at
      }
      customer{
        cardcode
        name
      }
      partner{
        cardcode
        name
        drivers {
          id
          mobile
        }
      }
      truck{
        id
        truck_no
        truck_type{
          id
          name
        }
      }
      source{
        id
        name
      }
      destination{
        id
        name
      }
      trip_status{
        id
        name
      }
      trip_prices(limit:1, where:{deleted_at:{_is_null:true}})
      {
        id
        customer_price
        partner_price
        cash
        to_pay
        comment
        bank
        mamul
        including_loading
        including_unloading
        customer_advance_percentage
      }
      trip_files{
        id
        type
        file_path
        folder
      }
    }
  }
`
