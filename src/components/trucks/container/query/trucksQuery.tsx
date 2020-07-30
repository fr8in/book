import { gql } from '@apollo/client'

export const TRUCKS_QUERY = gql`
  query trucks($offset: Int!, $limit: Int! , $trip_status_id:[Int!]) {
    truck(offset: $offset, limit: $limit) {
      truck_no
      truck_type_id
      truck_status_id
      truck_type{
        value
      }
      city {
        name
      }
      truck_status {
        id
        value
      }
      partner {
        name
        partner_users(limit:1 , where:{is_admin:{_eq:true}}){
          mobile
        }
        cardcode
      }
      trips(where: {trip_status_id: {_in: $trip_status_id}}) {
        id
        source {
          name
        }
        destination {
          name
        }
      }
    }
    truck_status{
      id 
      value
    }
    
  }
      
`
