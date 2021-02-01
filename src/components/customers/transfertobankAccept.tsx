import { Modal, Form, Input, message, Button,Row,Col } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation,useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import Loading from '../common/loading'

const GET_TOKEN = gql`
query get_token (
  $customer_id: Int!
){
  token(ref_id:$customer_id,process:"MAMUL_TRANSFER")
}`

const REJECT_BANK_TRANSFER_MUTATION = gql`
mutation reject_customer_mamul_transfer ($id:Int,$approved_by:String,$approved_on:timestamp) {
    update_customer_wallet_outgoing(_set: {status: "REJECTED" , approved_by: $approved_by,approved_on:$approved_on}where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  `

const APPROVAL_BANK_TRANSFER_MUTATION = gql`
mutation approvecustomermamultransfer ($approved_by:String!,$id:Int!,$approved_amount:Int!,$token:String!,$process:String!){
  approve_customer_mamul_transfer(approved_by:$approved_by,id:$id,approved_amount:$approved_amount,token:$token,process:$process ){
    description
    status
  }
}`

const TransferToBankAccept = (props) => {
  const { visible, onHide, item_id, title } = props
 
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)
  const customer_id  = get (item_id,'customers[0].id',null)
  
  const { loading, data, error } = useQuery(GET_TOKEN, { variables: { customer_id }, fetchPolicy: 'network-only' })

  if (error) {
    message.error(error.toString())
    onHide()
  }

  const [rejectTransfer] = useMutation(
    REJECT_BANK_TRANSFER_MUTATION, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Bank Transfer Rejected')
        onHide()
      }
    })
  const [transferApproval,{ loading: mutationLoading }] = useMutation(
    APPROVAL_BANK_TRANSFER_MUTATION, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        const status = get(data, 'approve_customer_mamul_transfer.status', null)
        const description = get(data, 'approve_customer_mamul_transfer.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          message.success(description || 'Approved!')
          onHide()
        } else {
          message.error(description)
          setDisableButton(false)
          onHide()
        }
      }
    })

  const onSubmit = (form) => {
     if (title === 'Approve') {
      setDisableButton(true)
      transferApproval({
        variables: {
          token: data.token,
          id: item_id.id,
          approved_by: context.email,
          approved_amount: item_id.amount,
          process:"MAMUL_TRANSFER"
        }
      })
    } else {
      setDisableButton(true)
      rejectTransfer({
        variables: {
          id: item_id.id,
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
      <Form layout='vertical'  onFinish={onSubmit}>
        <Row gutter={10}>
          <Col xs={12}>
            <Form.Item
              label='Account Name'
              name='account_name'
              initialValue={item_id.account_holder_name}
              rules={[{ required: true, message: 'Account name required!' }]}
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              label='Account Number'
              name='account_number'
              initialValue={item_id.account_no}
              rules={[{ required: true, message: 'Account number required!' }]}
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={8}>
            <Form.Item
              label='IFSC Code'
              name='ifsc'
              initialValue={item_id.ifsc_code}
              rules={[{ required: true, message: 'IFSC required!' }]}
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label='Amount'
              name='amount'
              initialValue={item_id.amount}
              rules={[{ required: true, message: 'Amount required!' }]}
            >
              <Input
                disabled
                type='number'
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label='Trip Id'
              name='trip_id'
              initialValue={item_id.load_id}
              rules={[{ required: true, message: 'Trip id required!' }]}
            >
              <Input
                type='number'
                disabled
              />
            </Form.Item>
          </Col>
        </Row>  
          <Form.Item className='text-right'>
  <Button type='primary' size='middle' key='submit' loading={disableButton} htmlType='submit'>{title === 'Approve'? 'Approve': 'Reject'}</Button>
         </Form.Item>
      </Form>
       {(loading || mutationLoading) &&
        <Loading fixed />} 
    </Modal>
  )
}

export default TransferToBankAccept
