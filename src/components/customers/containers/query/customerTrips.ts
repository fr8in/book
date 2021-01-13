import { gql } from '@apollo/client'

const CUSTOMER_TRIPS = gql`
query customer_trip_list($cardcode: String, $where:trip_bool_exp) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    trips(where:$where order_by:{trip_receipts_aggregate:{sum:{amount:asc_nulls_first}}}) {
      id
      created_at
      pod_verified_at
      paid_tat
      closed_tat
      delivered_tat
      invoiced_tat
      confirmed_tat
      loading_tat
      intransit_tat
      unloading_tat
      received_tat
      truck {
        truck_no
        truck_type {
          code
        }
      }
      source {
        name
      }
      destination {
        name
      }
      partner {
        id
        cardcode
        name
      }
      trip_status {
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
