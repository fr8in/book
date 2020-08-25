import { Modal, Select, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { isArray } from 'lodash'

const EMP_LIST = gql`
query create_partner{
  employee{
    id
    email
  }
}
`
const UPDATE_OWNER_MUTATION = gql`
mutation update_owner($id:[Int!],$onboarded_by_id:Int) {
  update_partner(_set: {onboarded_by_id: $onboarded_by_id}, where: {id: {_in: $id}}) {
    returning {
      id
    }
  }
}
`

const EmployeeList = (props) => {
  const { visible, onHide, partner_ids } = props
 
  const [employees, setEmployees] = useState('')
  //console.log('onboarded_by', onboarded_by)
console.log('partner_ids',partner_ids)

  const { loading, error, data } = useQuery(
    EMP_LIST,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)
  
  const [updateOwner] = useMutation(
    UPDATE_OWNER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { 
        message.success('Updated!!') 
      }
    }
  )

  var employee = []
  if (!loading) {
    employee = data && data.employee
  }
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const employeeChange = (value) => {
    setEmployees(value)
  }
  var arr_partner_ids= null
 if (isArray(partner_ids)){
  arr_partner_ids= partner_ids
 }
 else {
  arr_partner_ids= []
  arr_partner_ids.push(partner_ids)
 }
 

  console.log('arr_partner_ids',arr_partner_ids,isArray(partner_ids) )
  const onSubmit = () => {
    updateOwner({
      variables: {
        id: arr_partner_ids,
        onboarded_by_id: employees
      }
    })
  }
 

  return (
    <Modal
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Select value={employees} onChange={employeeChange} style={{ width: 300 }} options={employeeList} />
    </Modal>
  )
}

export default EmployeeList
