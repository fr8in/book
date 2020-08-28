import { gql } from '@apollo/client'

const CUSTOMER_TRIPS = gql`
subscription customer_trips($cardcode: String, $trip_status: [String!]) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    trips(where: {trip_status: {name: {_in: $trip_status}}}) {
      id
      order_date
      km
      driver
      trip_comments(limit: 1, order_by: {created_at: desc}) {
        description
      }
      employee {
        name
        region {
          branches {
            name
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
      partner {
        name
      }
      truck {
        truck_no
        length
        truck_type {
          name
        }
      }
      trip_prices(limit: 1, where: {deleted_at: {_is_null: true}}) {
        customer_price
        partner_price
      }
    }
  }
}
`

export default CUSTOMER_TRIPS
