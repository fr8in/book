import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String, $ongoing: [String!], $delivered: [String!], $invoiced: [String!], $recieved: [String!]) {
    customer(where: { cardcode: { _eq: $cardcode } }) {
      ongoing:trips_aggregate(where: {trip_status: {name: {_in: $ongoing}}}) {
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
      name
      mobile
      approved_by_id
      exception_date
      gst
      managed
      pan
      customer_type{
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
      # customer_users{
      #   name
      #   mobile
      #   email
      # }
      # customer_branches {
      #   branch_name
      #   name
      #   address
      #   # state {
      #   #   name
      #   # }
      #   # city {
      #   #   name
      #   # }
      #   pincode
      #   mobile
      # }
      # customer_mamul_summary {
      #   system_mamul_avg
      # }
    }
}
`
