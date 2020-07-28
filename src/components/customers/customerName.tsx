import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_CUSTOMER_NAME_MUTATION } from './containers/query/updateCustomerNameMutation'

const CustomerName = (props) => {
  const { cardcode, name } = props

  const [updateCustomerName] = useMutation(
    UPDATE_CUSTOMER_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
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
