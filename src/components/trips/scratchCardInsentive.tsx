import { useState, useContext } from 'react'
import { Row, Col, Input, Select, Form, Button, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

const SCRATCH_CARD_INCENTIVE_SUBSCRIPTION = gql`
subscription incentive_type {
  incentive_config(where:{auto_creation:{_eq:false}}){
    id
    type
    type_id
  }
}
`

const SCRATCH_CARD_INCENTIVE_MUTATION = gql`
mutation create_incentive($trip_id: Int!, $type_id: Int!, $created_by: String!,$comment:String,$partner_id:Int!) {
  create_incentive(trip_id: $trip_id, type_id: $type_id, created_by: $created_by, comment: $comment,partner_id:$partner_id) {
    status
    description
  }
}
`

const Incentive = (props) => {

  const { trip_id, trip_info } = props
  const context = useContext(userContext)
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)

  const invoiced = get(trip_info, 'invoiced_at', null)
  const received = get(trip_info, 'received_at', null)
  const closed = get(trip_info, 'closed_at', null)
  const lock = get(trip_info, 'transaction_lock', null)
  const partner_id = get(trip_info, 'partner.id', null)

  const [createIncentive] = useMutation(
    SCRATCH_CARD_INCENTIVE_MUTATION,
    {
      onError(error) {
        setDisableButton(true)
        message.error(error.toString())
      },
      onCompleted(data) {
        const status = get(data, 'create_incentive.status', null)
        const description = get(data, 'create_incentive.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          message.success("Created")
          form.resetFields()
        } else {
          message.error(description)
          form.resetFields()
          setDisableButton(false)
        }
      }
    }
  )

  const { loading, error, data } = useSubscription(
    SCRATCH_CARD_INCENTIVE_SUBSCRIPTION
  )
  console.log('creditDebitIsuueType error', error)

  var _data = []
  if (!loading) {
    _data = data
  }

  const issue_type = get(_data, 'incentive_config', [])
  const type_list = !isEmpty(issue_type) ? issue_type.map((data) => {
    return { value: data.type_id, label: data.type }
  }) : []

  const create_credit_debit = (form) => {
    setDisableButton(true)
    createIncentive({
      variables: {
        type_id: form.type_id,
        trip_id: parseInt(trip_id),
        created_by: context.email,
        comment: form.comment,
        partner_id: partner_id
      }
    })
  }

  return (
      <Form layout='vertical' onFinish={create_credit_debit}>
        <Row gutter={10}>
            <Form.Item label='Incentive Type' name='type_id' rules={[{ required: true }]}>
              <Select
                id='incentiveType'
                placeholder='Select Incentive Type'
                options={type_list}
              />
            </Form.Item>
        </Row>
        <Row gutter={10}>
          <Col flex='auto'>
            <Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
              <Input
                placeholder='Enter the Comment'
              />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Form.Item label='save' className='hideLabel'>
              <Button
                type='primary'
                key='submit'
                htmlType='submit'
                loading={disableButton}
                disabled={
                  ( !invoiced || received || closed || lock) 
                }
              >
                Submit
              </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Incentive
