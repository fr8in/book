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
    advancePending: trips_aggregate(where: {trip_accounting: {receipt_ratio: {_lt: 0.5}}, source_out: {_is_null: false}, trip_status: {name: {_neq: "Cancelled"}}}) {
      aggregate {
        count
      }
    }
    incoming:customer_incoming_aggregate{
      aggregate{
        count
      }
    }
    id
    cardcode
    walletcode
    name
    mobile
    approved_by_id
    gst
    managed
    pan
    is_exception
    customer_exception{
    invoice_pending
    advance_pending_amount
    total_advance_pending_amount
    receipts_and_receivables_ratio
    total_outstanding
    is_exception
     final_payment_received_in_the_last_30_days
     advance_pending_for_more_than_5_days
     payment_pending_for_more_than_30_days
     }
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
