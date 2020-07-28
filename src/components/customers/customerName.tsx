import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_CUSTOMER_NAME_MUTATION } from './containers/query/updateCustomerNameMutation'

const CustomerName = (props) => {
  const { cardcode, name } = props

  const [updateCustomerName] = useMutation(UPDATE_CUSTOMER_NAME_MUTATION)

  const onSubmit = (text, success, err) => {
    if (err) {
      message.error(err)
    } else {
      updateCustomerName({
        variables: {
          cardcode,
          name: text
        }
      }).then(data => {
        if (data) message.success(success)
      }).catch(error => {
        message.success(error)
      })
    }
  }

  return (
    <InlineEdit
      text={name || 'No Name'}
      onSetText={onSubmit}
    />
  )
}

export default CustomerName
