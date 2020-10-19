import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'

const CUSTOMERS_TYPE_QUERY = gql`
  query customer_type{
  customer_type{
    id
    name
  }
}
`
const UPDATE_CUSTOMER_TYPE_MUTATION = gql`
mutation customer_type_update($type_id:Int,$cardcode:String,$updated_by:String!) {
  update_customer(_set: {customer_type_id: $type_id,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      customer_type_id
    }
  }
}
`

const CustomerType = (props) => {
  const { type, cardcode, edit_access } = props
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(CUSTOMERS_TYPE_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  const [updateCustomerTypeId] = useMutation(UPDATE_CUSTOMER_TYPE_MUTATION, {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Updated!!') }
  })

  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('CustomerType error', error)

  const customer_type = get(_data, 'customer_type', [])
  const typeList = customer_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const handleChange = (value) => {
    updateCustomerTypeId({
      variables: {
        cardcode,
        type_id: value,
        updated_by: context.email
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        label={type}
        value={type}
        options={typeList}
        handleChange={handleChange}
        style={{ width: 110 }}
        edit_access={edit_access}
      />)
  )
}

export default CustomerType
