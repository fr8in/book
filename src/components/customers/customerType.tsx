import { message } from 'antd'
import { useQuery, useMutation } from '@apollo/client'
import { CUSTOMERS_TYPE_QUERY } from './containers/query/customersTypeQuery'
import { UPDATE_CUSTOMER_TYPE_MUTATION } from './containers/query/updateCustomerTypeMutation'
import InlineSelect from '../common/inlineSelect'

const CustomerType = (props) => {
  const { type, cardcode } = props

  const { loading, error, data } = useQuery(
    CUSTOMERS_TYPE_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateCustomerTypeId] = useMutation(
    UPDATE_CUSTOMER_TYPE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('CustomerType error', error)

  const { customer_type } = data
  const typeList = customer_type.map(data => {
    return { value: data.value, label: data.comment }
  })

  const handleChange = (value) => {
    updateCustomerTypeId({
      variables: {
        cardcode,
        type_id: value
      }
    })
  }

  return (
    <InlineSelect
      label={type}
      value={type}
      options={typeList}
      handleChange={handleChange}
      style={{ width: 110 }}
    />
  )
}

export default CustomerType
