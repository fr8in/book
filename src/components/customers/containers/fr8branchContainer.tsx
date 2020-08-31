import Fr8Branch from '../fr8Branch'
import React from 'react'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const EMPLOOYEE_QUERY = gql`
subscription customer_fr8Branch_manager($id: Int){
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
         
const { loading, error, data } = useSubscription(
    EMPLOOYEE_QUERY, 
    {
        variables: variables
  })
  console.log('error', error)
  console.log('id',variables)
  
let _data = []
if (!loading){
     _data = data 
}
const branch = get(_data,'branch',[])
console.log('branch',branch)

  return (
    <Fr8Branch
         id={id}
         fr8Branch={branch}
    />
  )
}

export default CustomersContainer
