import { Modal, Form, Input, message, Button } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation, useQuery} from '@apollo/client'
import get from 'lodash/get'

import userContext from '../../../lib/userContaxt'
import Loading from '../../common/loading'

const GET_TOKEN = gql`
query get_token (
  $trip_id: Int!
){
  token(ref_id: $trip_id, process: "CREDIT_NOTE_APPROVAL")
}`

const REJECT_CREDIT_MUTATION = gql`
mutation reject_credit($id:Int!,$remarks:String){
  update_trip_credit_debit(_set: {credit_debit_status_id: 3,approval_comment:$remarks}
    , where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}`

const CREDIT_APPROVAL_MUTATION = gql`
mutation approve_credit(
  $id: Int!
  $approved_by: String!
  $approved_amount: Float!
  $approval_comment: String!
  $token:String!
  $process:String!
  ){
  approve_credit(
    id: $id
    approved_by: $approved_by
    approved_amount: $approved_amount
    approval_comment: $approval_comment
    token:$token,
    process:$process
  ){
    status
    description
  }
}`

const Approve = (props) => {
  const { visible, onHide, item_id,trip_id, title, setCreditNoteRefetch } = props
  console.log('trip_id',trip_id)
  console.log('item_id',item_id)
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)
  const { loading, data, error } = useQuery(GET_TOKEN, 
    { 
      variables: {trip_id: parseInt(trip_id) }, 
      fetchPolicy: 'network-only' ,
      skip: title === 'Reject'})

  if (error) {
    message.error(error.toString())
    onHide()
  }


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
  const [creditApproval,{ loading: mutationLoading }] = useMutation(
    CREDIT_APPROVAL_MUTATION, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        const status = get(data, 'approve_credit.status', null)
        const description = get(data, 'approve_credit.description', null)
        if (status === 'OK') {
          message.success(description || 'Credit Note Approved')
          setCreditNoteRefetch(true)
          setDisableButton(false)
          onHide()
        } else {
          setDisableButton(false)
          message.error(description)
        }
      }
    })

  const onSubmit = (form) => {
    if (form.amount && (item_id.amount < parseFloat(form.amount))) {
      message.error('Approval amount should be less than or equal to claim amount')
    } else if (title === 'Approve') {
      setDisableButton(true)
      creditApproval({
        variables: {
          id: item_id.id,
          approved_by: context.email,
          approved_amount: parseFloat(form.amount),
          approval_comment: form.remarks,
          token: data.token,
          process: "CREDIT_NOTE_APPROVAL"
        }
      })
    } else {
      setDisableButton(true)
      rejectCredit({
        variables: {
          id: item_id.id,
          remarks: form.remarks
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
          <Form.Item label='Amount' name='amount' rules={[{ required: true }]} extra={`Claim Amount: ${item_id.amount}`}>
            <Input placeholder='Approved amount' type='number' min={1} />
          </Form.Item>
        )}
        <Form.Item label='Remarks' name='remarks' rules={[{ required: true }]}>
          <Input placeholder='Remarks' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>Submit</Button>
        </Form.Item>
      </Form>
      {(loading || mutationLoading) &&
        <Loading fixed />}
    </Modal>
  )
}

export default Approve
