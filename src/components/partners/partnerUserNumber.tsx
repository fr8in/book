import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_PARTNER_NUMBER_MUTATION = gql`
mutation PartnerNumberEdit($mobile:String,$id:Int) {
    update_partner_user(_set: {mobile: $mobile}, where: {is_admin: {_eq: true}, id: {_eq: 2}}) {
      returning {
        id
        mobile
      }
    }
  }
`
const PartnerUserNumber = (props) => {
  const { id, mobile } = props

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
        id,
        mobile: text
      }
    })
  }

  return (
    <InlineEdit
      text={mobile || 'No UserNumber'}
      onSetText={onSubmit}
    />
  )
}

export default PartnerUserNumber
