import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const UPDATE_PARTNER_NUMBER_MUTATION = gql`
mutation partner_user_edit($mobile:String!,$id:Int!,$updated_by: String!) {
    update_partner_user(_set: {mobile: $mobile,updated_by:$updated_by}, where: {is_admin: {_eq: true}, id: {_eq: $id}}) {
      returning {
        id
        mobile
      }
    }
  }
`
const PartnerUserNumber = (props) => {
  const { id, mobile, loading } = props
  const context = useContext(userContext)

  const [updateUserNumber] = useMutation(
    UPDATE_PARTNER_NUMBER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updateUserNumber({
      variables: {
        id: id,
        mobile: text,
        updated_by: context.email
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={mobile || '-'}
        onSetText={onSubmit}
      />)
  )
}

export default PartnerUserNumber
