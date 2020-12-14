import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import EditableCell from '../common/editableCell'
import u from '../../lib/util'

const UPDATE_EMPLOYEE_CODE_MUTATION = gql`
mutation update_employee_code($id:Int,$employee_code:String){
    update_employee(where:{id:{_eq:$id}}_set:{employee_code:$employee_code}){
      returning{
        id
      }
    }
  }
`
const EmployeeCode = (props) => {
  const { id, label } = props

  const { role } = u
  const employee_code = [role.admin,role.hr]

  const [updateEmployeeCode] = useMutation(
    UPDATE_EMPLOYEE_CODE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )
  const onSubmit = (value) => {
    updateEmployeeCode({
      variables: {
        id: id,
        employee_code: value
      }
    })
  }

  return (
    <EditableCell
      label={label}
      onSubmit={onSubmit}
      edit_access={employee_code}
    />

  )
}

export default EmployeeCode
