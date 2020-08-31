import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'

const CUSTOMERS_ADVANCE_PERCENTAGE_QUERY = gql`
  query customerAdvancePercentage{
  customer_advance_percentage{
    id
    name
  }
}
`
const UPDATE_CUSTOMER_ADVANCE_MUTATION = gql`
mutation CustomerAdvaceUpdate($advance_percentage_id:Int,$cardcode:String) {
  update_customer(_set: {advance_percentage_id: $advance_percentage_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      advance_percentage_id
    }
  }
}
`

const CustomerAdvancePercentage = (props) => {
  const { advancePercentageId, advancePercentage, cardcode } = props

  const { loading, error, data } = useQuery(
    CUSTOMERS_ADVANCE_PERCENTAGE_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateCustomerTypeId] = useMutation(
    UPDATE_CUSTOMER_ADVANCE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('CustomerType error', error)

  const customer_advance_percentage = get(_data, 'customer_advance_percentage', [])
  const advancePercentageList = customer_advance_percentage.map(data => {
    return { value: data.id, label: data.name }
  })

  const handleChange = (value) => {
    updateCustomerTypeId({
      variables: {
        cardcode,
        advance_percentage_id: value
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        label={advancePercentage}
        value={advancePercentageId}
        options={advancePercentageList}
        handleChange={handleChange}
        style={{ width: '80%' }}
      />)
  )
}

export default CustomerAdvancePercentage
