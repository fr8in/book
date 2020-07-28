import { Checkbox } from 'antd'
import { useMutation } from '@apollo/client'
import { UPDATE_CUSTOMER_MANAGED_MUTATION } from './containers/query/updateCustomerManagedMutation'

const ManagedCustomer = (props) => {
  const { cardcode, isManaged } = props

  const [customerManaged] = useMutation(UPDATE_CUSTOMER_MANAGED_MUTATION)

  const onChange = (e) => {
    // TODO error handling
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
