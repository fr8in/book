import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import { useState, useContext } from 'react'

const ALL_EMPLOYEE = gql`
  query all_employee {
  employee(where:{active: {_eq: 1}}){
    id
    email
  }
}
`
const UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION = gql`
mutation customer_payment_manager($description: String, $topic: String, $customer_id: Int, $created_by: String,$payment_manager_id:Int,$cardcode:String,$updated_by:String!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer(_set: {payment_manager_id: $payment_manager_id,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      payment_manager_id
    }
  }
}
  
`
const CustomerPaymentManager = (props) => {
  const { paymentManagerId, paymentManager, cardcode , edit_access ,customer_id} = props
  const context = useContext(userContext)
  const { topic } = u

  const { loading, error, data } = useQuery(ALL_EMPLOYEE, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  const [updateCustomerTypeId] = useMutation(
    UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )

  if (loading) return null


  const { employee } = data
  const empList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const onChange = (value) => {
    updateCustomerTypeId({
      variables: {
        cardcode,
        updated_by: context.email,
        payment_manager_id: value,
        created_by: context.email,
        description:`${topic.customer_payment_manager} updated by ${context.email}`,
        topic:topic.customer_payment_manager,
        customer_id: customer_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        label={paymentManager}
        value={paymentManagerId}
        options={empList}
        handleChange={onChange}
        style={{ width: 110 }}
        edit_access={edit_access}
      />)
  )
}

export default CustomerPaymentManager
