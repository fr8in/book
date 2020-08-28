import Fr8Branch from '../fr8Branch'
import React from 'react'
import { gql, useQuery } from '@apollo/client'

const EMPLOOYEE_QUERY = gql`
{
  employee{
    name
    branch_employees{
      branch{
        name
      }
    }
  }
}
`
const CustomersContainer = (props) => {
    const { cardcode } = props
       
const { loading, error, data } = useQuery(
    EMPLOOYEE_QUERY, 
    {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('error', error)
  console.log('data',data)

  return (
     <Fr8Branch
         cardcode={cardcode}
          />
  )
}

export default CustomersContainer
