import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_PARTNER_GST_MUTATION = gql`
mutation PartnerGstEdit($gst:String,$cardcode:String) {
  update_partner(_set: {gst: $gst}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
const PartnerGst = (props) => {
  const { cardcode, gst,loading } = props

  const [updateGst] = useMutation(
    UPDATE_PARTNER_GST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updateGst({
      variables: {
        cardcode: cardcode,
        gst: text
      }
    })
  }

  return (
    loading ? null : (
    <InlineEdit
      text={gst}
      onSetText={onSubmit}
    />)
  )
}

export default PartnerGst
