import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'


const UPDATE_PARTNER_NAME_MUTATION = gql`
mutation partner_name_edit($name:String,$cardcode:String,$updated_by: String!) {
  update_partner(_set: {name: $name,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      name
    }
  }
}
`
const PartnerName = (props) => {
  const { cardcode, name, loading } = props
  const context = useContext(userContext)

  const [updatePartnerName] = useMutation(
    UPDATE_PARTNER_NAME_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updatePartnerName({
      variables: {
        cardcode: cardcode,
        name: text,
        updated_by: context.email
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={name}
        onSetText={onSubmit}
      />)
  )
}

export default PartnerName
