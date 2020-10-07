import { useState, useContext } from 'react'
import { Row, Col, Radio, Input, Select, Form, Button, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const CREDIT_DEBIT_ISSUE_TYPE_SUBSCRIPTION = gql`
subscription credit_debit_issue_type {
  credit_debit_type(where: {active: {_eq: true}}) {
    id
    active
    name
  }
}
`

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
)
{
  success
  message
}
}
`
const CREATE_DEBIT_MUTATION = gql`
mutation create_debit_track(
  $trip_id: Int!
  $created_by: String!
  $credit_debit_type_id: Int!
  $comment: String!
$amount: Float!
) {
create_debit_track(
  trip_id: $trip_id
  created_by: $created_by
  credit_debit_type_id: $credit_debit_type_id
  comment: $comment
  amount: $amount
)
{
  success
  message
}
}
`

const CreditNote = (props) => {
  const { trip_id } = props
  const [radioType, setRadioType] = useState('Credit Note')
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.rm, role.accounts_manager, role.billing]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false
  const [disableButton, setDisableButton] = useState(false)

  const { loading, error, data } = useSubscription(
    CREDIT_DEBIT_ISSUE_TYPE_SUBSCRIPTION
  )
  console.log('creditDebitIsuueType error', error)
  console.log('creditDebitIsuueType data', data)

  const [upadateCreditNote] = useMutation(
    CREATE_CREDIT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        console.log('credit data', data)
        if (data.create_credit_track.message) {
          message.success(data.create_credit_track && data.create_credit_track.message)
        } else {
          message.success(data.create_credit_track && data.create_credit_track.message)
        }
      }
    }
  )
  const [upadateDebitNote] = useMutation(
    CREATE_DEBIT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        console.log('debit data', data)
        if (data.create_debit_track.success) {
          message.success(data.create_debit_track && data.create_debit_track.message)
        } else {
          message.error(data.create_debit_track && data.create_debit_track.message)
        }
      }
    }
  )

  var issue_type = []
  if (!loading) {
    issue_type = data && data.credit_debit_type
  }

  const issue_type_list = issue_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const create_credit_debit = (form) => {
    console.log('form', form)
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
    }
    if (radioType === 'Debit Note') {
      setDisableButton(true)
      upadateDebitNote({
        variables: {
          credit_debit_type_id: form.issue_type,
          amount: parseFloat(form.amount),
          comment: form.comment,
          trip_id: parseInt(trip_id),
          created_by: context.email
        }
      })
    }
  }

  return (
    <>
      <Row className='mb10'>
        <Radio.Group
          className='radioGroup1' defaultValue={radioType}
          onChange={(e) => setRadioType(e.target.value)}
        >
          <Radio value='Credit Note'>Credit</Radio>
          {access && <Radio value='Debit Note'>Debit</Radio>}
        </Radio.Group>
      </Row>
      <Form layout='vertical' onFinish={create_credit_debit}>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
              <Input
                placeholder='amount'
                maxLength={5}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='Issue Type' name='issue_type'>
              <Select
                id='issueType'
                placeholder='Select Issue Type'
                options={issue_type_list}
              />
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
              <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default CreditNote
