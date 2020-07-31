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
            
            bank{
              id
              name
            }
            partner_users(limit:1 , where:{is_admin:{_eq:true}}){
              id
              mobile
            }
            final_payment_date
            trucks_aggregate(where:{truck_status_id:{_neq:7}}){
              aggregate{
                count
              }
            }
            onboarded_by{
                id
                name              
                email
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
            city {
              branch {
                region {
                  name
                }
              }
            }
                tds_percentage {
                  value
                }
                partner_advance_percentage {
                  value
                }
                partner_memberships(limit: 1, where: {deleted_at: {_is_null: true}}) {
                  id
                  membership_type {
                    id
                    value
                  }
                }
                partner_status{
                  id
                  value
                 } 
            trucks {
              truck_no
              truck_type{
                value
              }
              city{
                name
              }
              truck_status{
                id
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
