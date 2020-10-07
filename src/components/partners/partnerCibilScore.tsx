import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const UPDATE_CIBIL_SCORE_MUTATION = gql`
mutation partner_cibil_score_edit($cibil:String,$cardcode:String,$updated_by: String!) {
  update_partner(_set: {cibil: $cibil,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      cibil
    }
  }
}
`
const PartnerCibilScore = (props) => {
  const { cardcode, cibil, loading } = props
  const context = useContext(userContext)

  const [updateCibilScore] = useMutation(
    UPDATE_CIBIL_SCORE_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updateCibilScore({
      variables: {
        cardcode: cardcode,
        cibil: text,
        updated_by: context.email
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={cibil || '-'}
        onSetText={onSubmit}
      />)
  )
}

export default PartnerCibilScore
