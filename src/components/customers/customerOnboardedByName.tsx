import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const ALL_EMPLOYEE = gql`
  query allEmployee {
  employee{
    id
    email
  }
}`

const UPDATE_PARTNER_ONBOARDED_BY_NAME_MUTATION = gql`
mutation customer_onboarded_by_name($onboarded_by_id:Int,$cardcode:String!,$updated_by:String!) {
update_customer(_set:{onboarded_by_id: $onboarded_by_id,updated_by:$updated_by}, where:{cardcode: {_eq:$cardcode}}){
    returning{
      id
      onboarded_by_id   
    }
  }
}
`

const OnBoardedBy = (props) => {
  const { onboardedById, onboardedBy, cardcode ,edit_access} = props
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
        updated_by: context.email,
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
      edit_access={edit_access}
    />
  )
}

export default OnBoardedBy
