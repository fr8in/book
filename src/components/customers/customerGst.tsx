import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_CUSTOMER_GST_MUTATION = gql`
mutation customer_gst_edit($gst:String,$cardcode:String) {
  update_customer(_set: {gst: $gst}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
const CustomerGst = (props) => {
  const { cardcode, gst, loading } = props

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
    loading ? null : (
      <InlineEdit
        text={gst || 'Nill'}
        onSetText={onSubmit}
      />)
  )
}

export default CustomerGst
