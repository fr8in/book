import { gql } from '@apollo/client'

export const PARTNER_DETAIL_SUBSCRIPTION = gql`
  subscription partners($cardcode: String,$trip_status_value: [String!],$ongoing: [String!], $pod: [String!], $invoiced: [String!], $paid: [String!]) {
    partner(where: {cardcode: {_eq: $cardcode}}) {
            ongoing: trips_aggregate(where: {trip_status: {value: {_in: $ongoing}}}) {
              aggregate {
                count
              }
            }
            pod: trips_aggregate(where: {trip_status: {value: {_in: $pod}}}) {
              aggregate {
                count
              }
            }
            invoiced: trips_aggregate(where: {trip_status: {value: {_in: $invoiced}}}) {
              aggregate {
                count
              }
            }
            paid: trips_aggregate(where: {trip_status: {value: {_in: $paid}}}) {
              aggregate {
                count
              }
            }
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
            pin_code
            onboarded_date
            walletcode
            wallet_block
            emi
            dnd
            cibil
            final_payment_date
            bank{
              id
              name
            }
            partner_users(limit:1 , where:{is_admin:{_eq:true}}){
              id
              mobile
            }
            
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
           # city{
           #     id
           #     name
           #     branch {
            #      region {
             #       name
             #     }
             #   }
          # }  
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
            trips(where: {trip_status: { value: {_in: $trip_status_value}}}){
              id
              order_date
              source{
                name
              }
              destination{
                name
              }
              source_in
              trip_status{
                value
              }
            }
            trucks {
              truck_no
              truck_type{
                name
              }
              city{
                name
              }
              truck_status{
                id
                value
              }        
              trips(where: {trip_status: {value: {_in: $trip_status_value}}}) {
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
