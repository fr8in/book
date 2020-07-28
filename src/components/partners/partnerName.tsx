import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_PARTNER_NAME_MUTATION } from './container/query/upadatePartnerNameMutation'

const PartnerName = (props) => {
  const { cardcode, name } = props

  const [updatePartnerName] = useMutation(
      UPDATE_PARTNER_NAME_MUTATION,
      {
        onError (error) { message.error(error.toString()) }
      }
      )

  const onSubmit = (text) => {
    
        updatePartnerName({
        variables: {
          cardcode,
          name: text
        }
      })
  }

  return (
    <InlineEdit
      text={name || 'No Name'}
      onSetText={onSubmit}
    />
  )
}

export default PartnerName
