import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import EditableCell from '../common/editableCell'
import { useContext } from 'react'
import userContext from '../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'
import u from '../../lib/util'
const UPDATE_EMPLOYEE_NO_MUTATION = gql`
mutation insert_branch($id:Int!, $mobile:String) {
    update_employee_by_pk(pk_columns:{id:$id}, _set:{mobileno:$mobile}){
      id
    }
  }
`
const EmployeeNumber = (props) => {
  const { id, label } = props

  const {role} = u
  const employee_number = [role.admin]

  const [updateTruckNo] = useMutation(
    UPDATE_EMPLOYEE_NO_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onSubmit = (value) => {
    updateTruckNo({
      variables: {
        id: id,
        mobile: value
      }
    })
  }

  return (

    <EditableCell
    label={label}
    onSubmit={onSubmit}
    edit_access = {employee_number}
  />
    
  )
}

export default EmployeeNumber
