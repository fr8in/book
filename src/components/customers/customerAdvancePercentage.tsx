import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'

const CUSTOMERS_ADVANCE_PERCENTAGE_QUERY = gql`
  query customer_advance_percentage{
  customer_advance_percentage{
    id
    name
  }
}
`
const UPDATE_CUSTOMER_ADVANCE_MUTATION = gql`
mutation customer_advance_update($advance_percentage_id:Int,$cardcode:String,$updated_by:String!) {
  update_customer(_set: {advance_percentage_id: $advance_percentage_id,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      advance_percentage_id
    }
  }
}
`

const CustomerAdvancePercentage = (props) => {
  const { advancePercentageId, advancePercentage, cardcode } = props
  const context = useContext(userContext)
  const { role } = u
  const customerAdvancePercentageEdit = [role.admin, role.accounts_manager, role.accounts]

  const { loading, error, data } = useQuery(
    CUSTOMERS_ADVANCE_PERCENTAGE_QUERY,
    {
      fetchPolicy: 'cache-and-network',
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
        updated_by: context.email,
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
        edit_access={customerAdvancePercentageEdit}
      />)
  )
}

export default CustomerAdvancePercentage
