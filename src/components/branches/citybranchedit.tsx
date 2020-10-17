import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'

const BRANCH_QUERY = gql`
  query city_branch{
    branch{
        id
        name
      }
}
`
const UPDATE_CITY_BRANCH_MUTATION = gql`
mutation update_city ($city_id:Int,$branch_id:Int){
    update_city(_set: {branch_id:$branch_id }, where: {id: {_eq: $city_id}}) {
      returning {
        branch {
          name
        }
      }
    }
  }
`

const Fr8Employee = (props) => {
  const { id, branch, edit_access } = props

  const { loading, error, data } = useQuery(
    BRANCH_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateBranch] = useMutation(
    UPDATE_CITY_BRANCH_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('error', error)

  const branches = get(_data, 'branch', [])
  const branchlist = branches.map(data => {
    return { value: data.id, label: data.name }
  })

  const handleChange = (value) => {
    updateBranch({
      variables: {
        city_id: id,
        branch_id: value
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        options={branchlist}
        label={branch}
        handleChange={handleChange}
        style={{ width: '40%' }}
        edit_access={edit_access}
      />)
  )
}

export default Fr8Employee
