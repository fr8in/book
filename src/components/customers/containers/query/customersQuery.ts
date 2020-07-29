import { gql } from '@apollo/client'

export const CUSTOMERS_QUERY = gql`
  query customers($offset: Int!, $limit: Int!, $statusId:[Int!]) {
    customer(
      offset: $offset, 
      limit: $limit,
      where: { 
        status: {
          id: {_in: $statusId}
        } 
      }
    ) {
      cardcode
      customerUsers{
        id
        name
      }
      name
      mobile
      type_id
      created_at
      pan
      advancePercentage{
        id
        value
      }
      status {
        id
        value
      }
    }
    customer_status(order_by: {id:asc}){
      id
      value
    }
  }
`
