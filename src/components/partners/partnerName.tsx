import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const UPDATE_PARTNER_NAME_MUTATION = gql`

mutation partner_name_edit($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$name:String,$cardcode:String!){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
   update_partner(_set: {name: $name,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      name
    }
  }
}
`
const PartnerName = (props) => {
  const { cardcode, name, loading,partner_id } = props
  const context = useContext(userContext)
  const { role,topic } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
 
  const [updatePartnerName] = useMutation(
    UPDATE_PARTNER_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updatePartnerName({
      variables: {
        cardcode: cardcode,
        name: text,
        updated_by: context.email,
        description:`${topic.partner_name} updated by ${context.email}`,
        topic:topic.partner_name,
        partner_id: partner_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={name}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default PartnerName
