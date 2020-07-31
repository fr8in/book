import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import { ALL_EMPLOYEE } from '../branches/container/query/employeeQuery'
import InlineSelect from '../common/inlineSelect'

const UPDATE_PARTNER_ONBOARDED_BY_NAME_MUTATION = gql`
mutation partner_onboarded_by_name($onboarded_by_id:Int,$cardcode:String) {
update_partner(_set:{onboarded_by_id: $onboarded_by_id}, where:{cardcode: {_eq:$cardcode}}){
    returning{
      id
      onboarded_by_id   
    }
  }
}
`

const OnBoardedBy = (props) => {
  const { onboardedById, onboardedBy, cardcode } = props

  const { loading, error, data } = useQuery(
    ALL_EMPLOYEE,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [UpdateOnBoardedByName] = useMutation(
    UPDATE_PARTNER_ONBOARDED_BY_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('OnBoardedByName error', error)

  const { employee } = data
  const empList = employee.map(data => {
    return { value: data.id, label: data.email }
  })

  const onChange = (value) => {
    UpdateOnBoardedByName({
      variables: {
        cardcode,
        onboarded_by_id: value
      }
    })
  }

  return (
    <InlineSelect
      label={onboardedBy}
      value={onboardedById}
      options={empList}
      handleChange={onChange}
      style={{ width: 110 }}
    />
  )
}

export default OnBoardedBy
