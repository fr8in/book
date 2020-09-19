import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import get from 'lodash/get'

const UPDATE_CUSTOMER_NAME_MUTATION = gql`
mutation update_customer_name($cardcode: String!, $company_name: String!){
  update_customer_name(cardcode:$cardcode,company_name:$company_name){
    status
    description
  }
}
`
const CustomerName = (props) => {
  const { cardcode, name, loading } = props

  const [updateCustomerName] = useMutation(
    UPDATE_CUSTOMER_NAME_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted(data) {
        const status = get(data, 'update_customer_name.status', null)
        const description = get(data, 'update_customer_name.description', null)
        if (status === 'OK') {
          message.success(description || 'Updated!')
        } else (message.error(description))
      }
    }
  )

  const onSubmit = (text) => {
    updateCustomerName({
      variables: {
        cardcode,
        company_name: text
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={name}
        onSetText={onSubmit}
      />)
  )
}

export default CustomerName

