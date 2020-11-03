import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import { useState,useContext } from 'react'

const UPDATE_CUSTOMER_GST_MUTATION = gql`
mutation customer_gst_edit($description: String, $topic: String, $customer_id: Int, $created_by: String,$gst:String,$cardcode:String,$updated_by:String!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer(_set: {gst: $gst,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      gst
    }
  }
}
`
const CustomerGst = (props) => {
  const { cardcode, gst, loading,edit_access,customer_id } = props
  const context = useContext(userContext)
  const { topic } = u

  const [updateCustomerGst] = useMutation(
    UPDATE_CUSTOMER_GST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onSubmit = (text) => {
    updateCustomerGst({
      variables: {
        cardcode,
        updated_by: context.email,
        gst: text,
        created_by: context.email,
        description:`${topic.customer_gst} updated by ${context.email}`,
        topic:topic.customer_gst,
        customer_id: customer_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineEdit
        text={gst || 'Nill'}
        onSetText={onSubmit}
        edit_access={edit_access}
      />)
  )
}

export default CustomerGst
