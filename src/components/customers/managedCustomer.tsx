import { Checkbox, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const UPDATE_CUSTOMER_MANAGED_MUTATION = gql`
mutation customer_comment_insert($description: String, $topic: String, $customer_id: Int, $created_by: String,$managed:Boolean,$cardcode:String,$updated_by:String!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer(_set: {managed: $managed,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      managed
    }
  }
}
`

const ManagedCustomer = (props) => {
  const { cardcode, isManaged,edit_access,customer_id } = props
  const { topic } = u
  const context = useContext(userContext)
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

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
        updated_by: context.email,
        managed: e.target.checked,
        created_by: context.email,
        description:`${topic.managed_customer} updated by ${context.email}`,
        topic:topic.managed_customer,
        customer_id:customer_id
      }
    })
  }

  return (
    <div>
      <Checkbox
        onChange={onChange}
        checked={isManaged}
        disabled={!access}
      >
        Yes
      </Checkbox>
    </div>
  )
}

export default ManagedCustomer
