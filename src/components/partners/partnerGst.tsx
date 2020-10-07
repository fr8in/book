import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import {useContext } from 'react'

const UPDATE_PARTNER_GST_MUTATION = gql`
mutation partner_gst_edit($gst:String,$cardcode:String,$updated_by: String!) {
  update_partner(_set: {gst: $gst,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
const PartnerGst = (props) => {
  const { cardcode, gst, loading, edit_access } = props
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
        updated_by: context.email
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
