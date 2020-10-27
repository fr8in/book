import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import {useContext } from 'react'
import u from '../../lib/util'

const UPDATE_PARTNER_GST_MUTATION = gql`
mutation partner_gst_edit($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$gst:String,$cardcode:String){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
 update_partner(_set: {gst: $gst,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
const PartnerGst = (props) => {
  const { cardcode, gst, loading, edit_access,partner_id } = props
  const { topic } = u
  const context = useContext(userContext)

  const [updateGst] = useMutation(
    UPDATE_PARTNER_GST_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updateGst({
      variables: {
        cardcode: cardcode,
        gst: text,
        updated_by: context.email,
        description:`${topic.gst} updated by ${context.email}`,
        topic:topic.gst,
        partner_id: partner_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={gst}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default PartnerGst
