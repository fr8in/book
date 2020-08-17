import { gql } from '@apollo/client';

export const CUSTOMER_DETAIL_SUBSCRIPTION = gql`
  subscription customers($cardcode: String, $trip_status: [String!]) {
    customer(where: { cardcode: { _eq: $cardcode } }) {
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
      onboardedBy {
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
      customer_users {
        name
        mobile
        email
      }
      customerBranches {
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
        truck {
          truck_no
          length
          truck_type {
            name
          }
        }
        trip_prices(limit: 1, where:{deleted_at:{_is_null: true}}) {
          customer_price
        }
      }
    }
  }
`
