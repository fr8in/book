import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_PARTNER_NAME_MUTATION = gql`
mutation PartnerNameEdit($name:String,$cardcode:String) {
  update_partner(_set: {name: $name}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      name
    }
  }
}
`
const PartnerName = (props) => {
  const { cardcode, name } = props

  const [updatePartnerName] = useMutation(
    UPDATE_PARTNER_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
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
