import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_CUSTOMER_GST_MUTATION = gql`
mutation CustomerGstEdit($gst:String,$cardcode:String) {
  update_customer(_set: {gst: $gst}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
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
