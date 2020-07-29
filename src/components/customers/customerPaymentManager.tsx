import { Select, message } from 'antd'
import { CloseCircleTwoTone, EditTwoTone } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_EMPLOYEE } from '../branches/container/query/employeeQuery'
import { UPDATE_CUSTOMER_PAYMENT_MANAGER_MUTATION } from './containers/query/updateCustomerPaymentManagerMutation'
import useShowHide from '../../hooks/useShowHide'

const CustomerPaymentManager = (props) => {
  const { paymentManagerId, paymentManager, cardcode } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

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

  const handleChange = (value) => {
    console.log(`selected ${value}`)
    updateCustomerTypeId({
      variables: {
        cardcode,
        payment_manager_id: value
      }
    })
    onHide()
  }

  return (
    <div>
      {!visible.selectType ? (
        <label>
          {paymentManager}{' '}
          <EditTwoTone onClick={() => onShow('selectType')} />
        </label>)
        : (
          <span>
            <Select
              size='small'
              style={{ width: 110 }}
              placeholder='Select Type'
              options={empList}
              value={paymentManagerId}
              onChange={handleChange}
            />{' '}
            <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
  )
}

export default CustomerPaymentManager
