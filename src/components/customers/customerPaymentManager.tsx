import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import { ALL_EMPLOYEE } from '../branches/container/query/employeeQuery'
import InlineSelect from '../common/inlineSelect'

const UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION = gql`
mutation customerPaymentManager($payment_manager_id:Int,$cardcode:String) {
  update_customer(_set: {payment_manager_id: $payment_manager_id}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      payment_manager_id
    }
  }
}
`
const CustomerPaymentManager = (props) => {
  const { paymentManagerId, paymentManager, cardcode } = props

  const { loading, error, data } = useQuery(ALL_EMPLOYEE, {
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
  console.log('CustomerType error', error)

  const { employee } = data
  const empList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const onChange = (value) => {
    updateCustomerTypeId({
      variables: {
        cardcode,
        payment_manager_id: value
      }
    })
  }

  return (
    <InlineSelect
      label={paymentManager}
      value={paymentManagerId}
      options={empList}
      handleChange={onChange}
      style={{ width: 110 }}
    />
  )
}

export default CustomerPaymentManager
