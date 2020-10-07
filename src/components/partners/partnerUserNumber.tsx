import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import u from '../../lib/util'

const UPDATE_PARTNER_NUMBER_MUTATION = gql`
mutation partner_user_edit($mobile:String!,$id:Int!) {
    update_partner_user(_set: {mobile: $mobile}, where: {is_admin: {_eq: true}, id: {_eq: $id}}) {
      returning {
        id
        mobile
      }
    }
  }
`
const PartnerUserNumber = (props) => {
  const { id, mobile, loading } = props

  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]

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
        mobile: text
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={mobile || '-'}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default PartnerUserNumber
