
import { gql, useQuery } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'

const EMPLOYEE_QUERY = gql`
  query fr8Employee{
    employee{
        id
        name
        email
      }
}
`

const Fr8Employee = (props) => {
  
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

  const employees = get(_data, 'employee', [])
  const emplist = employees.map(data => {
    return { value: data.id, label: data.name }
  })

  const handleChange = (value) => { }

  return (
    loading ? null : (
      <InlineSelect
        options={emplist}
        handleChange={handleChange}
        style={{ width: '80%' }}
      />)
  )
}

export default Fr8Employee
