import { message } from 'antd'
import { gql, useQuery,useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'

const EMPLOYEE_QUERY = gql`
  query fr8_employee{
    employee{
        id
        name
        email
      }
}
`
const UPDATE_BRABCH_EMPLOYEE_MUTATION = gql`
mutation fr8_employee_edit($branch_id: Int, $employee_id: Int) {
  update_branch_employee(where: {branch_id: {_eq: $branch_id}, is_manager: {_eq: true}}, _set: {employee_id: $employee_id}) {
    returning {
      employee {
        name
      }
    }
  }
}
`

const Fr8Employee = (props) => {
  const { employee ,id} = props
  const { loading, error, data } = useQuery(
    EMPLOYEE_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('error', error)

  const [updateTruckNo] = useMutation(
    UPDATE_BRABCH_EMPLOYEE_MUTATION,
  {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Saved!!') }
  }
)

  const employees = get(_data, 'employee', [])
  const emplist = employees.map(data => {
    return { value: data.id, label: data.name }
  })

  const handleChange = (value) => {
    updateTruckNo({
      variables: {
        branch_id: id,
        employee_id: value
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        options={emplist}
        label={employee}
        handleChange={handleChange}
        style={{ width: '200px' }}
      />)
  )
}

export default Fr8Employee
