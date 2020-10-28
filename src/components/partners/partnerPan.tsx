import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import { useContext } from 'react'

const UPDATE_PARTNER_PAN_MUTATION = gql`
mutation partner_pan_edit($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$pan:String,$cardcode:String!){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
  update_partner(_set: {pan: $pan,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      pan
    }
  }
}
`
const PartnerPan = (props) => {
  const { cardcode, pan, loading, edit_access,partner_id } = props
  const { topic } = u
  const context = useContext(userContext)

  const [updatePan] = useMutation(
    UPDATE_PARTNER_PAN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updatePan({
      variables: {
        cardcode: cardcode,
        pan: text,
        updated_by: context.email,description:`${topic.pan} updated by ${context.email}`,
        topic:topic.pan,
        partner_id: partner_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={pan}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default PartnerPan
