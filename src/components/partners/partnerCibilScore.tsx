import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import {useContext } from 'react'

const UPDATE_CIBIL_SCORE_MUTATION = gql`
mutation partner_cibil_score_edit($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$cibil:String,$cardcode:String){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
  update_partner(_set: {cibil: $cibil,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      cibil
    }
  }
}
`
const PartnerCibilScore = (props) => {
  const { cardcode, cibil, loading, edit_access,partner_id } = props
  const { topic } = u
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
        updated_by: context.email,
        description:`${topic.cibil_score} updated by ${context.email}`,
        topic:topic.cibil_score,
        partner_id: partner_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={cibil || '-'}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default PartnerCibilScore
