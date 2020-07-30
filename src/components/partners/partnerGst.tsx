import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_PARTNER_GST_MUTATION } from './container/query/updatePartnerGstMutation'

const PartnerGst = (props) => {
  const { cardcode, gst } = props

  const [updateGst] = useMutation(
    UPDATE_PARTNER_GST_MUTATION ,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (text) => {
    updateGst({
      variables: {
        cardcode,
        gst: text
      }
    })
  }

  return (
    <InlineEdit
      text={gst || 'No Gst'}
      onSetText={onSubmit}
    />
  )
}

export default PartnerGst