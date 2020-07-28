import { Checkbox, message } from 'antd'
import { useMutation } from '@apollo/client'
import { UPDATE_CUSTOMER_MANAGED_MUTATION } from './containers/query/updateCustomerManagedMutation'

const ManagedCustomer = (props) => {
  const { cardcode, isManaged } = props

  const [customerManaged] = useMutation(
    UPDATE_CUSTOMER_MANAGED_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onChange = (e) => {
    customerManaged({
      variables: {
        cardcode,
        managed: e.target.checked
      }
    })
  }

  return (
    <div>
      <Checkbox
        onChange={onChange}
        checked={isManaged}
        disabled={false}
      >
        Yes
      </Checkbox>
    </div>
  )
}

export default ManagedCustomer
