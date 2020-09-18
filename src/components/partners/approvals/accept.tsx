import { Modal, Form, Input, message, Button, Row, Space } from 'antd'
import React from 'react'
import { gql, useMutation } from '@apollo/client'

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
}
`

const Approve = (props) => {
  const { visible, onHide, data, title } = props

  const [rejectCredit] = useMutation(
    REJECT_CREDIT_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const [creditApproval] = useMutation(
    CREDIT_APPROVAL_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })

  const onSubmit = (form) => {
    console.log('Fastag Amount Reversed!', data)
    onHide()
    if (title === 'Rejected') {
      rejectCredit({
        variables: {
          id: data,
          remarks: form.remarks
        }
      })
    } else {
      creditApproval({
        variables: {
          id: data,
          approved_by: 'jay',
          approved_amount: parseFloat(form.amount),
          approved_comment: form.remarks
        }
      })
    }
  }
  console.log('id', data)

  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
    >
      <Form layout='vertical' onFinish={onSubmit}>
        {title === 'Approved' && (
          <Form.Item label='Amount' name='amount'>
            <Input
              id='amount'
              required
             />
            <p>Claim Amount: </p>
          </Form.Item>
        )}
        <Form.Item label='Remarks' name='remarks' rules={[{ required: true }]}>
          <Input placeholder='Remarks' />
        </Form.Item>
        <Row justify='end'>

          <Form.Item>
            <Space>
              <Button type='primary' size='middle' onClick={onHide}>Cancel</Button>
              <Button type='primary' size='middle' htmlType='submit'>Submit</Button>
            </Space>
          </Form.Item>

        </Row>

      </Form>
    </Modal>
  )
}

export default Approve
