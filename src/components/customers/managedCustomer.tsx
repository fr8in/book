import { Checkbox, message } from 'antd'
import { gql, useMutation } from '@apollo/client'

const UPDATE_CUSTOMER_MANAGED_MUTATION = gql`
mutation customerManaged($managed:Boolean,$cardcode:String) {
  update_customer(_set: {managed: $managed}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      managed
    }
  }
}
`

const ManagedCustomer = (props) => {
  const { cardcode, isManaged } = props

  const [customerManaged] = useMutation(
    UPDATE_CUSTOMER_MANAGED_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
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
