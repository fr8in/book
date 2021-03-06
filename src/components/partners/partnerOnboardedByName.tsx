import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'

const ALL_EMPLOYEE = gql`
  query all_employee {
  employee(where:{active: {_eq: 1}}){
    id
    email
  }
}`

const UPDATE_PARTNER_ONBOARDED_BY_NAME_MUTATION = gql`
mutation partner_onboarded_by_name($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$cardcode:String,$onboarded_by_id:Int){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
update_partner(_set:{onboarded_by_id: $onboarded_by_id,updated_by:$updated_by}, where:{cardcode: {_eq:$cardcode}}){
    returning{
      id
      onboarded_by_id   
    }
  }
}
`
const UPDATE_CREDIT_RESPONSIBILITY_NAME_MUTATION = gql`
mutation update_credit_responsibility($responsibility_id:Int!,$id:Int! ){
  update_trip_credit_debit(_set: {responsibility_id: $responsibility_id}
    , where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`

const OnBoardedBy = (props) => {
  const { onboardedById, onboardedBy, cardcode, credit_debit_id, edit_access,partner_id } = props
  const context = useContext(userContext)
  const { topic } = u

  const { loading, error, data } = useQuery(
    ALL_EMPLOYEE,
    {
      fetchPolicy: 'cache-and-network',
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
  const [UpdateCreditResponsibilityName] = useMutation(
    UPDATE_CREDIT_RESPONSIBILITY_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  console.log('OnBoardedByName error', error)
  if (loading) return null

  const { employee } = data
  const empList = employee.map(data => {
    return { value: data.id, label: data.email }
  })

  const onChange = (value) => {
    if (credit_debit_id !== undefined) {
      UpdateCreditResponsibilityName({
        variables:
          {
            responsibility_id: value,
            id: props.credit_debit_id
          }
      })
    } else {
      UpdateOnBoardedByName({
        variables: {
          cardcode,
          onboarded_by_id: value,
          updated_by: context.email,
          description:`${topic.onboarded_by} updated by ${context.email}`,
        topic:topic.onboarded_by,
        partner_id: partner_id
        }
      })
    }
  }

  return (
    <InlineSelect
      label={onboardedBy}
      value={onboardedById}
      options={empList}
      handleChange={onChange}
      style={{ width: 110 }}
      edit_access={edit_access}
    />
  )
}

export default OnBoardedBy
