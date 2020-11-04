import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import {  useContext } from 'react'


const EMPLOYEE_QUERY = gql`
  query branch_employee($id: Int!) {
  branch(where:{id:{_eq:$id}}){
    id
    branch_employees{
      id
      employee{
        id
        name
        email
      }
    }
  }
}
`
const UPDATE_BRABCH_EMPLOYEE_MUTATION = gql`
mutation update_customer_branch_employee($description: String, $topic: String, $customer_id: Int, $created_by: String,$id:Int,$branch_employee_id: Int!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer_branch_employee(_set:{branch_employee_id: $branch_employee_id}, where:{id:{_eq: $id}}){
    returning{ id }
  }
}`

const Fr8Employee = (props) => {
  const { employee, id, edit_access, branch_id ,customer_id} = props
  const context = useContext(userContext)
  const { topic } = u

  const { loading, error, data } = useQuery(
    EMPLOYEE_QUERY,
    {
      variables: { id: branch_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const [update_customer_branch_employee] = useMutation(
    UPDATE_BRABCH_EMPLOYEE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const employees = get(_data, 'branch[0].branch_employees', [])
  const emplist = employees.map(data => {
    return { value: data.id, label: data.employee.name }
  })

  const handleChange = (value) => {
    update_customer_branch_employee({
      variables: {
        id: id,
        branch_employee_id: value,
        created_by: context.email,
        description:`${topic.customer_fr8_employee} updated by ${context.email}`,
        topic:topic.customer_fr8_employee,
        customer_id: customer_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        options={emplist}
        label={employee}
        value={employee}
        handleChange={handleChange}
        style={{ width: '200px' }}
        edit_access={edit_access}
      />)
  )
}

export default Fr8Employee
