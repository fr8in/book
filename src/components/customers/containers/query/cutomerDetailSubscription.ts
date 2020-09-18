import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers_detail($cardcode: String, $ongoing: [String!], $delivered: [String!], $invoiced: [String!], $recieved: [String!]) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    ongoing: trips_aggregate(where: {trip_status: {name: {_in: $ongoing}}}) {
      aggregate {
        count
      }
    }
    delivered: trips_aggregate(where: {trip_status: {name: {_in: $delivered}}}) {
      aggregate {
        count
      }
    }
    invoiced: trips_aggregate(where: {trip_status: {name: {_in: $invoiced}}}) {
      aggregate {
        count
      }
    }
    recieved: trips_aggregate(where: {trip_status: {name: {_in: $recieved}}}) {
      aggregate {
        count
      }
    }
    id
    cardcode
    walletcode
    name
    mobile
    approved_by_id
    exception_date
    gst
    managed
    pan
    customer_files {
      id
      type
      folder
      file_path
      created_at
      customer_id
    }
    customer_accounting {
      wallet_balance
    }
    customer_type {
      id
      name
    }
    virtual_account
    status {
      id
      name
    }
    onboarded_by {
      id
      email
    }
    payment_manager {
      id
      email
    }
    customer_type {
      id
      name
    }
    system_mamul
  }
}`
