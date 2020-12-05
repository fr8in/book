import { Modal, Form, Input, message, Button } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation,useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import Loading from '../common/loading'

// const GET_TOKEN = gql`
// query get_token (
//   $customer_id: Int!
// ){
//   token(ref_id:$customer_id,process:"MAMUL_TRANSFER")
// }`

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
  const { visible, onHide, item_id, title } = props
  console.log('ite,',item_id)
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

  const customer_id  = get (item_id,'customers[0].id',null)
  console.log('id',customer_id)

  // const { loading, data, error } = useQuery(GET_TOKEN, { variables: { customer_id }, fetchPolicy: 'network-only' })

  // if (error) {
  //   message.error(error.toString())
  //   onHide()
  // }

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
  const [transferApproval,{ loading: mutationLoading }] = useMutation(
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
     if (title === 'Approved') {
      setDisableButton(true)
      transferApproval({
        variables: {
          // token: data.token,
          // customer_id,
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
        <Form.Item label='Remarks' name='remarks' extra={`Amount: ₹${item_id.amount}`} >
          <Input placeholder='Remarks' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>Submit</Button>
        </Form.Item>
      </Form>
      {/* {(loading || mutationLoading) &&
        <Loading fixed />} */}
    </Modal>
  )
}

export default Approve
