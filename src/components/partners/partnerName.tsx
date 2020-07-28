import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_PARTNER_NAME_MUTATION } from './container/query/upadatePartnerNameMutation'

const PartnerName = (props) => {
  const { cardcode, name } = props

  const [updatePartnerName] = useMutation(UPDATE_PARTNER_NAME_MUTATION)

  const onSubmit = (text, success, err) => {
    if (err) {
      message.error(err)
    } else {
        updatePartnerName({
        variables: {
          cardcode,
          name: text
        }
      }).then(data => {
        if (data) message.success(success)
      }).catch(error => {
        message.success(error)
      })
    }
  }

  return (
    <InlineEdit
      text={name || 'No Name'}
      onSetText={onSubmit}
    />
  )
}

export default PartnerName
