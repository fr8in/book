import { gql } from '@apollo/client'

export const PARTNER_DETAIL_SUBSCRIPTION = gql`
  subscription partners($cardcode: String,$trip_status_id:[Int!]) {
    partner(where: {cardcode: {_eq: $cardcode}}) {
            id
            name
            cardcode
            account_number
            virtual_account
            partner_advance_percentage_id
            gst
            ifsc_code
            address
            pan
            bank_id
            final_payment_date
            onboarded_by{
                id
                name
              }
              city{
                id
                name
              }
            pin_code
            onboarded_date
            walletcode
            wallet_block
            emi
            dnd
            cibil
            trucks {
              truck_no
              truck_type_id
              city{
                name
              }
              truck_status{
                value
              }        
              trips(where: {trip_status_id: {_in: $trip_status_id}}) {
                id
                source{
                  name
                }
                destination{
                  name
                }
              }
            }
          }    
        }
`