import { gql } from '@apollo/client'

export const ALL_EMPLOYEE = gql`
  query allEmployee {
  employee{
    id
    email
  }
}
`
