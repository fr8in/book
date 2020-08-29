import Fr8Branch from '../fr8Branch'
import React from 'react'
import { gql, useQuery } from '@apollo/client'

const EMPLOOYEE_QUERY = gql`
query customer_fr8Branch_manager($id: Int){
  branch{
    id
    name
    branch_employees(where: {is_manager:{_eq: true}}){
      customer_branch_employees(where:{customer_id:{_eq:$id}}){
        id
        customer_id
        branch_employee{
          id
          employee{
            id
            email
            name
          }
        }
      }
      employee{
        id
        name
        email
      }
    }
  }
}

`
const CustomersContainer = (props) => {
    const { id } = props
    const variables = {
        id:id
      }
         
const { loading, error, data } = useQuery(
    EMPLOOYEE_QUERY, 
    {
        variables: variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('error', error)
  console.log('id',variables)
  
var branch = []
if (!loading){
     branch = data && data.branch
}
console.log('branch',branch)

  return (
     <Fr8Branch
         id={id}
         customer_fr8Branch={branch}
          />
  )
}

export default CustomersContainer
