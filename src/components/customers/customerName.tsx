import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_CUSTOMER_NAME_MUTATION } from './containers/query/updateCustomerNameMutation'

const CustomerName = (props) => {
  const { cardCode, name } = props

  const [updateStatusId] = useMutation(UPDATE_CUSTOMER_NAME_MUTATION)

  const onSubmit = (text, success, err) => {
    if (err) {
      message.error(err)
    } else {
      updateStatusId({
        variables: {
          cardCode,
          name: text
        }
      })
      message.success(success)
    }
  }

  return (
    <InlineEdit
      text={name || 'No Name'}
      onSetText={onSubmit}
      objKey='name'
    />
  )
}

export default CustomerName
