import { gql } from '@apollo/client'

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String, $trip_status: [String!],$closed: [String!],$ongoing: [String!],$invoicepending: [String!],$final: [String!],$advancepending_o: [String!], $advancepending_c: [String!]) {
    customer(where: { cardcode: { _eq: $cardcode } }) {
      closed: trips_aggregate(where: {trip_status: {name: {_in: $closed}}}) {
        aggregate {
          count
        }
      }
      ongoing:trips_aggregate(where: {trip_status: {name: {_in: $ongoing}}}) {
        aggregate {
          count
        }
      }
      invoicepending: trips_aggregate(where: {trip_status: {name: {_in: $invoicepending}}}) {
        aggregate {
          count
        }
      }
      final: trips_aggregate(where: {trip_status: {name: {_in: $final}}}) {
        aggregate {
          count
        }
      }
      advancepending_o:trips_aggregate(where: {trip_status: {name: {_in: $advancepending_o}}}) {
        aggregate {
          count
        }
      }
      advancepending_c:trips_aggregate(where: {trip_status: {name: {_in: $advancepending_c}}}) {
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
