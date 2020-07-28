import { useMutation } from '@apollo/client'

import InlineEdit from '../common/inlineEdit'
import { UPDATE_CUSTOMER_NAME_MUTATION } from './containers/query/updateCustomerNameMutation'

const CustomerName = (props) => {
  const { cardcode, name } = props

  const [updateCustomerName,{ loading, error },] = useMutation(UPDATE_CUSTOMER_NAME_MUTATION)

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
      error ={error}

    />
  )
}

export default CustomerName
