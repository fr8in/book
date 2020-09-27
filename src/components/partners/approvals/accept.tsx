import { Modal, Form, Input, message, Button } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState, useContext } from 'react'
import userContext from '../../../lib/userContaxt'

const REJECT_CREDIT_MUTATION = gql`
mutation reject_credit($id:Int!,$remarks:String){
  update_trip_credit_debit(_set: {credit_debit_status_id: 3,approval_comment:$remarks}
    , where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`
const CREDIT_APPROVAL_MUTATION = gql`
mutation approve_credit(
  $id: Int!
  $approved_by: String!
  $approved_amount: Float!
  $approved_comment: String!
){
  approve_credit(
    id: $id
    approved_by: $approved_by
    approved_amount: $approved_amount
    approved_comment: $approved_comment
  ){
    success
    message
  }
}`

const Approve = (props) => {
  const { visible, onHide, item_id, title } = props
  const context = useContext(userContext)

  const [disableButton, setDisableButton] = useState(false)

  const [rejectCredit] = useMutation(
    REJECT_CREDIT_MUTATION, {
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
  const [creditApproval] = useMutation(
    CREDIT_APPROVAL_MUTATION, {
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

  const onSubmit = (form) => {
    console.log('Fastag Amount Reversed!', form)
    setDisableButton(true)
    if (title === 'Approved') {
      creditApproval({
        variables: {
          id: item_id.id,
          approved_by: context.email,
          approved_amount: parseFloat(form.amount),
          approved_comment: form.remarks
        }
      })
    } else {
      rejectCredit({
        variables: {
          id: item_id,
          remarks: form.remarks
        }
      })
    }
  }
  console.log('id', item_id)

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Form layout='vertical' onFinish={onSubmit}>
        {title === 'Approved' && (
          <Form.Item label='Amount' name='amount' rules={[{ required: true }]} extra={`Claim Amount: ${item_id.amount}`}>
            <Input placeholder='Approved amount' />
          </Form.Item>
        )}
        <Form.Item label='Remarks' name='remarks' rules={[{ required: true }]}>
          <Input placeholder='Remarks' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>Submit</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Approve
