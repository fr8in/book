import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_PARTNER_PAN_MUTATION } from './container/query/updatePanNumberMutation'

const PartnerPan = (props) => {
  const { cardcode, pan } = props

  const [updatePan] = useMutation(
    UPDATE_PARTNER_PAN_MUTATION ,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (text) => {
    updatePan({
      variables: {
        cardcode,
        pan: text
      }
    })
  }

  return (
    <InlineEdit
      text={pan || 'No Pan'}
      onSetText={onSubmit}
    />
  )
}

export default PartnerPan
