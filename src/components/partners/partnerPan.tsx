import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_PARTNER_PAN_MUTATION = gql`
mutation PartnerPanEdit($pan:String,$cardcode:String) {
  update_partner(_set: {pan: $pan}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      pan
    }
  }
}
`
const PartnerPan = (props) => {
  const { cardcode, pan,loading } = props

  const [updatePan] = useMutation(
    UPDATE_PARTNER_PAN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updatePan({
      variables: {
        cardcode: cardcode,
        pan: text
      }
    })
  }

  return (
    loading ? null : (
    <InlineEdit
      text={pan}
      onSetText={onSubmit}
    />)
  )
}

export default PartnerPan
