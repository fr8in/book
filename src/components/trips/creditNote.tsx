import { useState, useContext } from 'react'
import { Row, Col, Radio, Input, Select, Form, Button, message } from 'antd'
import { gql, useSubscription, useMutation, useQuery } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import Loading from '../common/loading'

const GET_TOKEN = gql`
query get_token (
  $trip_id: Int!
){
  token(ref_id: $trip_id, process: "DEBIT_NOTE_APPROVAL")
}`

const CREDIT_DEBIT_ISSUE_TYPE_SUBSCRIPTION = gql`
subscription credit_debit_issue_type {
  credit_debit_type(where: {active: {_eq: true}}) {
    id
    active
    name
  }
}`

const CREATE_CREDIT_MUTATION = gql`
mutation create_credit_track(
  $trip_id: Int!
  $created_by: String!
  $credit_debit_type_id: Int!
  $comment: String!
  $amount: Float!
  ) {
    create_credit_track(
      trip_id: $trip_id
      created_by: $created_by
      credit_debit_type_id: $credit_debit_type_id
      comment: $comment
      amount: $amount
    ) {
    success
    message
  }
}`

const CREATE_DEBIT_MUTATION = gql`
mutation create_debit_track(
  $trip_id: Int!
  $created_by: String!
  $credit_debit_type_id: Int!
  $comment: String!
  $amount: Float!
  $token:String!
  $process:String!
  ) {
  create_debit_track(
    trip_id: $trip_id
    created_by: $created_by
    credit_debit_type_id: $credit_debit_type_id
    comment: $comment
    amount: $amount
    token:$token
    process:$process
  ) {
    status
    description
  }
}`

const CreditNote = (props) => {
  const { trip_id, trip_info } = props
  const [radioType, setRadioType] = useState('Credit Note')
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.rm, role.accounts_manager, role.billing, role.partner_manager, role.partner_support, role.bm]
  const access = u.is_roles(edit_access, context)
  const [disableButton, setDisableButton] = useState(false)
  const [form] = Form.useForm()
  const status_s = u.creditDebit
  const invoiced = get(trip_info, 'invoiced_at', null)
  const received = get(trip_info, 'received_at', null)
  const closed = get(trip_info, 'closed_at', null)
  const lock = get(trip_info, 'transaction_lock', null)
  const status = get(trip_info, 'trip_status.id', null)

  const { loading: token_loading, data: token_data, error: token_error, refetch } = useQuery(GET_TOKEN,
    {
      variables: { trip_id: parseInt(trip_id) },
      fetchPolicy: 'network-only',
      skip: radioType === 'Credit Note'
    })

  if (token_error) {
    message.error(token_error.toString())
    radioType
  }

  const { loading, error, data } = useSubscription(
    CREDIT_DEBIT_ISSUE_TYPE_SUBSCRIPTION
  )
  console.log('creditDebitIsuueType error', error)

  const [upadateCreditNote] = useMutation(
    CREATE_CREDIT_MUTATION,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted(data) {
        setDisableButton(false)
        const status = get(data, 'create_credit_track.success', null)
        const msg = get(data, 'create_credit_track.message', 'Created!')
        form.resetFields()
        if (status) {
          message.success(msg)
          form.resetFields()
        } else {
          message.error(msg)
        }
      }
    }
  )
  const [upadateDebitNote, { loading: mutationLoading }] = useMutation(
    CREATE_DEBIT_MUTATION,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted(data) {
        setDisableButton(false)
        form.resetFields()
        const status = get(data, 'create_debit_track.status', null)
        const msg = get(data, 'create_debit_track.description', null)
        if (status === 'OK') {
          message.success(msg || 'Approved!')
          form.resetFields()
        } else {
          message.error(msg || 'Error')
        }
        setTimeout(() => {
          refetch()
        }, 5000)
      }
    }
  )

  var issue_type = []
  if (!loading) {
    issue_type = data && data.credit_debit_type
  }
  const typeList = status_s.map((data) => {
    return { value: data.value, label: data.text }
  })


  const issue_type_list = !isEmpty(issue_type) ? issue_type.map((data) => {
    return { value: data.id, label: data.name }
  }) : []

  const create_credit_debit = (form) => {
    if (radioType === 'Credit Note') {
      setDisableButton(true)
      upadateCreditNote({
        variables: {
          credit_debit_type_id: form.issue_type,
          amount: parseFloat(form.amount),
          comment: form.comment,
          trip_id: parseInt(trip_id),
          created_by: context.email
        }
      })
    } else if (radioType === 'Debit Note') {
      setDisableButton(true)
      upadateDebitNote({
        variables: {
          credit_debit_type_id: form.issue_type,
          amount: parseFloat(form.amount),
          comment: form.comment,
          trip_id: parseInt(trip_id),
          created_by: context.email,
          token: token_data.token,
          process: "DEBIT_NOTE_APPROVAL"
        }
      })
    } else { return null }
  }

  return (
    <>
      <Form layout='vertical' onFinish={create_credit_debit} form={form}>
        <Form.Item name='type' initialValue={radioType}>
          <Radio.Group
            onChange={(e) => setRadioType(e.target.value)}
          >
            <Radio value='Credit Note'>Credit</Radio>
            <Radio value='Debit Note'>Debit</Radio>
          </Radio.Group>
        </Form.Item>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
              <Input
                placeholder='amount'
                type='number'
                min={1}
                step='any'
                maxLength={5}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='Issue Type' name='issue_type' rules={[{ required: true }]}>
              {
                ((status === 13) || (status === 15))  ? 
                <Select
                id='issueType'
                placeholder='Select Issue Type'
                options={typeList}
              />
              :
              <Select
                id='issueType'
                placeholder='Select Issue Type'
                options={issue_type_list}
              />}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col flex='auto'>
            <Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
              <Input
                placeholder='textarea'
              />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Form.Item label='save' className='hideLabel'>
              <Button
                type='primary'
                loading={disableButton}
                htmlType='submit'
                disabled={
                  ((invoiced && access && !received && !closed) ? false : !(radioType === 'Credit Note' && invoiced && !received && !closed)) || lock
                }
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {(token_loading || mutationLoading) &&
        <Loading fixed />}
    </>
  )
}

export default CreditNote
