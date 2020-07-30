import { gql } from '@apollo/client'

export const TRUCKS_TYPE_QUERY = gql`
  query truckType{
  truck_type{
    value
  }
}
`