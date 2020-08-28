import { gql } from '@apollo/client'

export const PARTNER_DETAIL_SUBSCRIPTION = gql`
subscription partners($cardcode: String,$partner_id:bigint,$trip_status_value: [String!],$ongoing: [String!], $pod: [String!], $invoiced: [String!], $paid: [String!]) {
  partner(where: {cardcode: {_eq: $cardcode}})
         {
          partner_accounting {
            cleared
            wallet_balance
            onhold
            commission
            billed
          }
          # fastags{
          #   tagId
          #   truck {
          #     truck_no
          #   }
          #   partner {
          #     cardcode
          #     name
          #   }
          #   balance
          #   tag_status {
          #     id
          #     status
          #   }
          # }
          ongoing: trips_aggregate(where: {trip_status: {name: {_in: $ongoing}}}) {
            aggregate {
              count
            }
          }
          pod: trips_aggregate(where: {trip_status: {name: {_in: $pod}}}) {
            aggregate {
              count
            }
          }
          invoiced: trips_aggregate(where: {trip_status: {name: {_in: $invoiced}}}) {
            aggregate {
              count
            }
          }
          paid: trips_aggregate(where: {trip_status: {name: {_in: $paid}}}) {
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
          partner_files{
            file_path
            id
            folder
            type
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
        #   city{
        #       id
        #       name
        #       branch {
        #         region {
        #           name
        #         }
        #       }
        #  }  
         tds_percentage {
            name
          }
          partner_advance_percentage {
            name
          }
          partner_memberships(limit: 1, where: {deleted_at: {_is_null: true}}) {
            id
            membership_type {
              id
              name
            }
          }
          partner_status{
            id
            name
          }
          trips(where: {trip_status: { name: {_in: $trip_status_value}}}){
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
              name
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
              name
            }        
            # trips(where: {trip_status: {name: {_in: $trip_status_value}}}) {
            #   id
            #   source{
            #     name
            #   }
            #   destination{
            #     name
            #   }
            # }
          }
        }    
      }
      `