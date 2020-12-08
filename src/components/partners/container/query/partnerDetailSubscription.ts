import { gql } from '@apollo/client'

export const PARTNER_DETAIL_SUBSCRIPTION = gql`
subscription partner_detail($cardcode: String!, $ongoing: [String!], $pod: [String!], $invoiced: [String!], $paid: [String!],$year:Int,$month:Int) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    partner_accounting {
      cleared
      wallet_balance
      onhold
      commission
      billed
    }
    partner_membership_targets(where: {year: {_eq: $year}, month: {_eq: $month}}) {
      gold
      platinum
      month
      actual {
        gmv
      }
    }
    partner_active{
     amount
    }
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
    trucks_aggregate(where: {truck_status:{name:{_neq: "Rejected"} }}) {
      aggregate {
        count
      }
    }
    id
    name
    cardcode
    display_account_number
    virtual_account
    partner_advance_percentage_id
    gst
    ifsc_code
    account_holder
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
    bank {
      id
      name
    }
    trucks(limit:1){
      id
      truck_no
    }
     partner_users(limit: 1, where: {is_admin: {_eq: true}}) {
      id
      mobile
    }
    partner_files {
      id
      type
      folder
      file_path
      created_at
    }
    onboarded_by {
      id
      name
      email
    }
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
    partner_status {
      id
      name
    }
    city {
      name
      state {
        name
      }
      branch {
        region {
          name
        }
      }
    }
  }
}
`
