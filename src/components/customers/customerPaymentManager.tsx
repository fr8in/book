import { message } from 'antd'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_EMPLOYEE } from '../branches/container/query/employeeQuery'
import { UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION } from './containers/query/updateCustomerPaymentManagerMutation'
import InlineSelect from '../common/inlineSelect'

const CustomerPaymentManager = (props) => {
  const { paymentManagerId, paymentManager, cardcode } = props

  const { loading, error, data } = useQuery(
    ALL_EMPLOYEE,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateCustomerTypeId] = useMutation(
    UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('CustomerType error', error)

  const { employee } = data
  const empList = employee.map(data => {
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
