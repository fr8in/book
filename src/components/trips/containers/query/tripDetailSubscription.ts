import { gql } from '@apollo/client'

export const TRIP_DETAIL_SUBSCRIPTION = gql`
  subscription trips_detail($id: Int) {
    trip(where: {id:{_eq:$id}}){
      id
      order_date
      source_in
      source_out
      loaded
      status_at
      pod_verified_at
      destination_in
      destination_out
      km
      driver{
        id
        mobile
      }
      delay
      eta
      po_date
      ap
      ar
      unloaded_private_godown
      private_godown_address
      lr
      lr_incentive
      pod_incentive
      customer_confirmation
      customer{
        cardcode
        name
      }
      partner{
        id
        cardcode
        name
        walletcode
        drivers {
          id
          mobile
        }
        partner_advance_percentage{
          id
          name
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
      customer_price
      partner_price
      cash
      to_pay
      bank
      mamul
      including_loading
      including_unloading
      customer_advance_percentage
      ton
      is_price_per_ton
      price_per_ton
      billing_remarks
      trip_files {
       id
       type
       file_path
       folder
      }
    }
  }
`
