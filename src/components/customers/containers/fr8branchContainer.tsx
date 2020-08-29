import Fr8Branch from '../fr8Branch'
import React from 'react'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const EMPLOOYEE_QUERY = gql`
query fr8branch($cardcode:String){
    employee(where:{trips:{customer:{cardcode:{_eq:$cardcode}}}}){
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
    const variables = {
        cardcode: cardcode
      }
         
const { loading, error, data } = useQuery(
    EMPLOOYEE_QUERY, 
    {
        variables: variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('error', error)
  console.log('data',data)

//   var _data = {};
//   if (!loading) {
//     _data = data
//   }
//   console.log('_data',_data)
var employee = []
if (!loading){
     employee = data && data.employee
}
console.log('employee',employee)
  return (
     <Fr8Branch
         cardcode={cardcode}
         employee={employee}
          />
  )
}

export default CustomersContainer
