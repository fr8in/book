import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'

const ALL_EMPLOYEE = gql`
  query allEmployee {
  employee(where:{active: {_eq: 1}}){
    id
    email
  }
}`

const UPDATE_PARTNER_ONBOARDED_BY_NAME_MUTATION = gql`
mutation partner_onboarded_by_name($onboarded_by_id:Int,$cardcode:String,$updated_by: String!) {
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
  const { onboardedById, onboardedBy, cardcode, credit_debit_id, edit_access } = props
  const context = useContext(userContext)

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
  const [UpdateCreditResponsibilityName] = useMutation(
    UPDATE_CREDIT_RESPONSIBILITY_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  // console.log('OnBoardedByName error', error)

  const { employee } = data
  const empList = employee.map(data => {
    return { value: data.id, label: data.email }
  })

  const onChange = (value) => {
    console.log('credit_debit_id', credit_debit_id)
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
          updated_by: context.email
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
