import { Modal, Form, Input, message, Button } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'

import userContext from '../../../lib/userContaxt'

const REJECT_INCENTIVE_MUTATION = gql`
mutation delete_incentive($id: Int!,$comment:String!) {
  update_incentive(where: {id: {_eq: $id}}, _set: {status_id: 5, comment: $comment}) {
    returning {
      id
    }
  }
}
  `

const INCENTIVE_APPROVAL_MUTATION = gql`
mutation approve_incentive($id:Int!,$approved_by:String!,$trip_id:Int!){
  approve_incentive(id:$id,approved_by:$approved_by,trip_id:$trip_id){
    description
    status
  }
}
`

const IncentiveApprove = (props) => {
  const { visible, onHide, item_id, title, setCreditNoteRefetch ,trip_id} = props
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

  console.log('item_id',item_id)

  const [rejectIncentive] = useMutation(
    REJECT_INCENTIVE_MUTATION, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    })

  const [incentiveApproval] = useMutation(
    INCENTIVE_APPROVAL_MUTATION, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        const status = get(data, 'approve_credit.success', null)
        if (status) {
          message.success(get(data, 'approve_credit.message', 'Approved!!'))
          setCreditNoteRefetch(true)
          setDisableButton(false)
          onHide()
        } else {
          setDisableButton(false)
          message.error(get(data, 'approve_credit.message', 'Error Occured!!'))
        }
      }
    })

  const onSubmit = (form) => {
     if (title === 'Approved') {
      setDisableButton(true)
      incentiveApproval({
        variables: {
          id:item_id,
          approved_by:context.email,
          trip_id:trip_id
        }
      })
    } else {
      setDisableButton(true)
      rejectIncentive({
        variables: {
          id: item_id,
          comment: form.comment
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
        {title === 'Approved' && (
          <>
          <Form.Item label='Amount' name='amount' initialValue={item_id.amount} >
            <Input placeholder='Approved amount' type='number' min={1} disabled={true}/>
          </Form.Item>
           <Form.Item label='Incentive Type' name='type'  initialValue={item_id.incentive_config.type}>
           <Input placeholder='Type'   disabled={true}/>
         </Form.Item>
         </>
        )}
        <Form.Item label='Remarks' name='comment' rules={[{ required: true }]}>
          <Input placeholder='Remarks' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>Submit</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IncentiveApprove
