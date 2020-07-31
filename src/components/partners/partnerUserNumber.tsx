import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_PARTNER_NUMBER_MUTATION } from './container/query/updatePhoneNumberMutation'

const PartnerUserNumber = (props) => {
  const { id, mobile } = props

  const [updateUserNumber] = useMutation(
    UPDATE_PARTNER_NUMBER_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
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