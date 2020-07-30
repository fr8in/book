import { gql } from '@apollo/client'

export const CUSTOMERS_QUERY = gql`
  query customers($offset: Int!, $limit: Int!, $statusId:[Int!], $name:String, $mobile:String) {
    customer(
      offset: $offset, 
      limit: $limit,
      where: { 
        status: {
          id: {_in: $statusId},
        },
        name: {_ilike: $name},
        mobile: {_like: $mobile}
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
    customer_aggregate {
      aggregate {
        count
      }
    }
    customer_status(order_by: {id:asc}){
      id
      value
    }
  }
`
