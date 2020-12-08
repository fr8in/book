import { useState, useContext } from 'react'
import { Row, Col, Radio, Input, Select, Form, Button, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

const SCRATCH_CARD_INCENTIVE_SUBSCRIPTION = gql`
subscription incentive_type {
  incentive_config{
    id
    type
  }
}
`

const SCRATCH_CARD_INCENTIVE_MUTATION = gql`
mutation($trip_id:Int!,$type_id:Int!,$created_by:String!,$comment:String!){
  create_incentive(trip_id:$trip_id,type_id:$type_id,comment:$comment,created_by:$created_by){
    description
    status
  }
}`

const Incentive = (props) => {

  const {trip_id} = props
  const context = useContext(userContext)

  const [disableButton, setDisableButton] = useState(false)

  const issue_type_list = [
    {
      value: '1',
      label: 'Referral '
    }
  ]


  const [createIncentive] = useMutation(
    SCRATCH_CARD_INCENTIVE_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        message.success("Created")
      }
    }
  )

  const { loading, error, data } = useSubscription(
    SCRATCH_CARD_INCENTIVE_SUBSCRIPTION
  )
  console.log('creditDebitIsuueType error', error)

  console.log('data',data)

  var issue_type = []
  if (!loading) {
    issue_type = data  && data.incentive_config
  }

  const type_list = !isEmpty(issue_type) ? issue_type.map((data) => {
    return { value: data.id, label: data.type }
  }) : []

 

  const create_credit_debit = (form) => {
      setDisableButton(true)
      createIncentive({
        variables: {
        type_id:form.type_id,
          comment: form.comment,
          trip_id: parseInt(trip_id),
          created_by: context.email
        }
      })
    }

  return (
    <>
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
                placeholder='textarea'
              />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Form.Item label='save' className='hideLabel'>
              <Button
                type='primary'
                htmlType='submit'
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Incentive
