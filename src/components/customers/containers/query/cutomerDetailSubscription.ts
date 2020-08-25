import { gql } from '@apollo/client';

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String, $trip_status: [String!],$closed: [String!],$ongoing: [String!],$invoicepending: [String!],$final: [String!],$advancepending: [String!]) {
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
      advancepending:trips_aggregate(where: {trip_status: {name: {_in: $advancepending}}}) {
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
      paymentManager {
        id
        email
      }
      customer_type {
        id
        name
      }
      customer_users{
        name
        mobile
        email
      }
      customer_branches {
        branch_name
        name
        address
        state {
          name
        }
        city {
          name
        }
        pincode
        mobile
      }
      customer_mamul_summary {
        system_mamul_avg
      }
      trips(where: { trip_status: { name: { _in: $trip_status } } }) {
        id
        order_date
        km
        driver
        trip_comments(limit:1, order_by: {created_at: desc}){
          description
        }
        employee{
          name
          region{
            branches{
              name
              order
            }
          }
        }
        customer {
          customer_users {
            name
          }
        }
        trip_status {
          name
        }
        source {
          name
        }
        destination {
          name
        }
        partner{
          name
        }
        truck {
          truck_no
          length
          truck_type {
            name
          }
        }
        trip_prices(limit: 1, where:{deleted_at:{_is_null: true}}) {
          customer_price
          partner_price
        }
      }
    }
}
`
