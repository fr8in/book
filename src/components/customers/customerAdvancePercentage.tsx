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
mutation customer_advance_update($description: String, $topic: String, $customer_id: Int, $created_by: String,$advance_percentage_id:Int,$updated_by:String!,$id:Int!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer(_set: {advance_percentage_id: $advance_percentage_id,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      advance_percentage_id
    }
  }
}
`

const CustomerAdvancePercentage = (props) => {
  const { record } = props
  const context = useContext(userContext)
  const { role,topic } = u
  const customerAdvancePercentageEdit = [role.admin, role.accounts_manager, role.accounts]

  const advancePercentage = get(record, 'customer_advance_percentage.name', '-')
  const advancePercentageId = get(record, 'customer_advance_percentage.id', null)
  const customer_id = get(record, 'id', null)

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
        customer_id: customer_id,
        updated_by: context.email,
        advance_percentage_id: value,
        created_by: context.email,
        description:`${topic.customer_advance_percentage} updated by ${context.email}`,
        topic:topic.customer_advance_percentage,
        id: customer_id
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
