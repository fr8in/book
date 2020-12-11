import { Modal, Form, Input, message, Button } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation,useQuery } from '@apollo/client'
import get from 'lodash/get'
import Loading from '../../common/loading'

import userContext from '../../../lib/userContaxt'

const GET_TOKEN = gql`
query get_token($trip_id: Int!) {
  token(ref_id: $trip_id, process: "INCENTIVE_TRACK")
}
`

const REJECT_INCENTIVE_MUTATION = gql`
mutation delete_incentive($id: Int!, $comment: String!,$approved_by:String) {
  update_incentive(where: {id: {_eq: $id}}, _set: {track_status_id: 3, comment: $comment,approved_by:$approved_by}) {
    returning {
      id
    }
  }
}
`

const INCENTIVE_APPROVAL_MUTATION = gql`
mutation approve_incentive($id:Int!,$approved_by:String!){
  approve_incentive(id:$id,approved_by:$approved_by){
    description
    status
  }
}
`

const IncentiveApprove = (props) => {
  const { visible, onHide, item_id, title, setIncentiveRefetch ,trip_id} = props
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)
  console.log('item_id',item_id)
  console.log('trip_id',trip_id)
  const { loading, data, error } = useQuery(GET_TOKEN, { variables: { trip_id:parseInt(trip_id) }, fetchPolicy: 'network-only' })

  if (error) {
    message.error(error.toString())
    onHide()
  }

  const [rejectIncentive,{ loading: mutationLoading }] = useMutation(
    REJECT_INCENTIVE_MUTATION, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
        onHide()
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Rejected!!')
        onHide()
      }
    })

  const [incentiveApproval] = useMutation(
    INCENTIVE_APPROVAL_MUTATION, 
    {
      onError(error) { 
        setDisableButton(false)
        message.error(error.toString())
      onHide() },
      onCompleted(data) {
        const status = get(data, 'approve_incentive.status', null)
        const description = get(data, 'approve_incentive.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          setIncentiveRefetch(true)
          onHide()
        message.success("Approved!!")
        } else{
         message.error(description)
         setDisableButton(false)
         onHide()
        }
      }
    })

  const onSubmit = (form) => {
     if (title === 'Approved') {
      setDisableButton(true)
      incentiveApproval({
        variables: {
          token: data.token,
          id:item_id.id,
          approved_by:context.email
        }
      })
    } else {
      setDisableButton(true)
      rejectIncentive({
        variables: {
          id: item_id.id,
          comment: form.comment,
          approved_by:context.email
        }
      })
    }
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Form layout='vertical' onFinish={onSubmit}>
        {title === 'Approve' && (
          <>
          <Form.Item label='Amount' name='amount' initialValue={item_id.amount} >
            <Input placeholder='Approved amount' type='number' min={1} disabled={true}/>
          </Form.Item>
           <Form.Item label='Incentive Type' name='type'  initialValue={item_id.incentive_config.type}>
           <Input placeholder='Type'   disabled={true}/>
         </Form.Item>
         </>
        )}
        { title === 'Reject' && (
        <Form.Item label='Remarks' name='comment' rules={[{ required: true }]}>
          <Input placeholder='Remarks' />
        </Form.Item> )}
        <Form.Item className='text-right'>
          <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>Submit</Button>
        </Form.Item> 
      </Form> 
       {(loading || mutationLoading) &&
        <Loading fixed />} 
    </Modal>
  )
}

export default IncentiveApprove
