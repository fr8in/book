import { gql } from '@apollo/client'

const CUSTOMER_TRIPS = gql`
query customer_trip_list($cardcode: String, $trip_status: [String!],) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    trips(where:{trip_status:{name:{_in:$trip_status}}} order_by:{trip_receipts_aggregate:{sum:{amount:asc_nulls_first}}}) {
      id
      order_date
      truck {
        truck_no
        truck_type {
          name
        }
      }
      source {
        name
      }
      destination {
        name
      }
      partner {
        cardcode
        name
      }
      trip_status {
        name
      }
      trip_pod_status{
        name
      }
      trip_receivables_aggregate(where:{deleted_at:{_is_null:true}}) {
        aggregate {
          sum {
            amount
          }
        }
      }
      trip_receipts_aggregate(where:{deleted_at:{_is_null:true}}) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  }
}
`

export default CUSTOMER_TRIPS
