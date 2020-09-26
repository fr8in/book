import { gql } from '@apollo/client'

export const PARTNER_DETAIL_SUBSCRIPTION = gql`
subscription partner_detail($cardcode: String, $partner_id: bigint, $ongoing: [String!], $pod: [String!], $invoiced: [String!], $paid: [String!]) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    partner_accounting {
      cleared
      wallet_balance
      onhold
      commission
      billed
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
    account_number
    display_account_number
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
    bank {
      id
      name
    }
    partner_users(limit: 1, where: {is_admin: {_eq: true}}) {
      id
      mobile
    }
    partner_files(where: {deleted_at: {_is_null:true}}) {
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
}`
