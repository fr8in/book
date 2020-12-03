import { Modal, Form, Input, message, Button } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const REJECT_BANK_TRANSFER_MUTATION = gql`
mutation reject_customer_mamul_transfer ($id:Int,$approved_by:String,$approved_on:timestamp) {
    update_customer_wallet_outgoing(_set: {status: "REJECTED" , approved_by: $approved_by,approved_on:$approved_on}where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  `

const APPROVAL_BANK_TRANSFER_MUTATION = gql`
mutation approvecustomermamultransfer ($approved_by:String!,$id:Int!,$approved_amount:Int!,$status:String){
  approve_customer_mamul_transfer(approved_by:$approved_by,id:$id,approved_amount:$approved_amount,status:$status){
    description
    status
  }
}`

const Approve = (props) => {
  const { visible, onHide, item_id, title, setCreditNoteRefetch } = props
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

  const [rejectTransfer] = useMutation(
    REJECT_BANK_TRANSFER_MUTATION, {
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
  const [transferApproval] = useMutation(
    APPROVAL_BANK_TRANSFER_MUTATION, {
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
    if (form.amount && (item_id.amount < parseFloat(form.amount))) {
      message.error('Approval amount should be less than or equal to claim amount')
    } else if (title === 'Approved') {
      setDisableButton(true)
      transferApproval({
        variables: {
          id: item_id.id,
          approved_by: context.email,
          approved_on: new Date().toISOString(),
          approved_amount: item_id.amount,
          status:"APPROVED"
        }
      })
    } else {
      setDisableButton(true)
      rejectTransfer({
        variables: {
          id: item_id,
          approved_by: context.email,
          approved_on: new Date().toISOString()
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
      <Form layout='vertical' onFinish={onSubmit} >
        {/* {title === 'Approved' && (
          <Form.Item label='Amount' name='amount' rules={[{ required: true }]} extra={`Claim Amount: ${item_id.amount}`}>
            <Input placeholder='Approved amount' type='number' min={1} />
          </Form.Item>
        )} */}
        <Form.Item label='Remarks' name='remarks' >
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
