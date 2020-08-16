import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'

const CUSTOMERS_TYPE_QUERY = gql`
  query customerType{
  customer_type{
    id
    name
  }
}
`
const UPDATE_CUSTOMER_TYPE_MUTATION = gql`
mutation customerException($type_id:Int,$cardcode:String) {
  update_customer(_set: {customer_type_id: $type_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      customer_type_id
    }
  }
}
`

const CustomerType = (props) => {
  const { type, cardcode } = props

  const { loading, error, data } = useQuery(CUSTOMERS_TYPE_QUERY, {
    notifyOnNetworkStatusChange: true
  })

  const [updateCustomerTypeId] = useMutation(UPDATE_CUSTOMER_TYPE_MUTATION, {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Updated!!') }
  })

  if (loading) return null
  console.log('CustomerType error', error)

  const { customer_type } = data
  const typeList = customer_type.map((data) => {
    return { value: data.id, label: data.name }
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
