import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'

const UPDATE_CUSTOMER_NAME_MUTATION = gql`
mutation CustomerNameEdit($name:String,$cardcode:String) {
  update_customer(_set: {name: $name}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      name
    }
  }
}
`
const CustomerName = (props) => {
  const { cardcode, name } = props

  const [updateCustomerName] = useMutation(
    UPDATE_CUSTOMER_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (text) => {
    updateCustomerName({
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

export default CustomerName
