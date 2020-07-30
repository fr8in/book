import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_CUSTOMER_GST_MUTATION } from './containers/query/updateCustomerGstMutation'

const CustomerGst = (props) => {
  const { cardcode, gst } = props

  const [updateCustomerGst] = useMutation(
    UPDATE_CUSTOMER_GST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onSubmit = (text) => {
    updateCustomerGst({
      variables: {
        cardcode,
        gst: text
      }
    })
  }

  return (
    <InlineEdit
      text={gst || 'No Name'}
      onSetText={onSubmit}
    />
  )
}

export default CustomerGst
