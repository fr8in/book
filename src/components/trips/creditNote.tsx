import { useState } from 'react'
import { Row, Col, Radio, Input, Select, Form, Button, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'

const CREDIT_DEBIT_ISSUE_TYPE_SUBSCRIPTION = gql`
subscription credit_debit_issue_type {
  credit_debit_type(where: {active: {_eq: true}}) {
    id
    active
    name
  }
}
`
// const CREDIT_DEBIT_NOTES_MUTATION = gql`
// mutation create_credit_debit($credit_debit_type_id: Int, $amount: Float, $comment: String,$trip_id:Int,$type:bpchar,$created_by:String,$credit_debit_status_id:Int) {
//   insert_trip_credit_debit(objects: {credit_debit_type_id: $credit_debit_type_id, amount: $amount, comment: $comment,trip_id:$trip_id,type:$type,created_by:$created_by,credit_debit_status_id:$credit_debit_status_id}){
//     returning {
//       id
//       comment
//       trip_id
//     }
//   }
// }
// `

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
  const {trip_id} = props
  const [radioType, setRadioType] = useState('Credit Note')

  const { loading, error, data } = useSubscription(
    CREDIT_DEBIT_ISSUE_TYPE_SUBSCRIPTION
  )
  console.log('creditDebitIsuueType error', error)
  console.log('creditDebitIsuueType data', data)

  const [upadateCreditNote] = useMutation(
    CREATE_CREDIT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const [upadateDebitNote] = useMutation(
    CREATE_DEBIT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  var issue_type = []
  if (!loading) {
    issue_type = data.credit_debit_type
  }

  const issue_type_list = issue_type.map((data) => {
    return { value: data.id, label: data.name }
  })

const create_credit_debit = (form) =>{
  console.log('form',form)
  if (radioType === 'C'){
    upadateCreditNote ({
      variables:{
        credit_debit_type_id: form.issue_type,
        amount: parseFloat(form.amount),
        comment: form.comment,
        trip_id: parseInt(trip_id) ,
        created_by: "jay"
      }   
    })
  }
  else{
    upadateDebitNote ({
      variables:{
        credit_debit_type_id: form.issue_type,
        amount: parseFloat(form.amount),
        comment: form.comment,
        trip_id: parseInt(trip_id) ,
        created_by: "jay"
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
          <Radio value='Debit Note'>Debit</Radio>
        </Radio.Group>
      </Row>
      <Form layout='vertical' onFinish={create_credit_debit}>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item label='Amount' >
              <Input
                id='amount'
                maxLength={5}
                required
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
            <Form.Item label='Comment' name='comment'>
              <Input
                id='comment'
                type='textarea'
                required
                name='comment'
              />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Form.Item label='save' className='hideLabel'>
              <Button type='primary' htmlType='submit'>Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default CreditNote
