import { Modal, Form, Input, message, Row, Col, Button, Space } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'

import userContext from '../../../lib/userContaxt'

const UPDATE_FASTAG_REVERSE_MUTATION = gql`
mutation tag_reversal(
  $truckId: Int!
  $token: String!
  $partnerId: Int!
  $tagId: String!
  $modifiedBy: String!
  $reversalAmount: Int!
) {
  reverse_fastag(
    truck_id: $truckId
    token: $token
    partner_id: $partnerId
    tag_id: $tagId
    modified_by: $modifiedBy
    reversal_amount: $reversalAmount
  ) {
    status
    description
  }
}
`
const FastagReversal = (props) => {
  const { visible, onHide, fastag, token } = props

  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const [reverse_fastag] = useMutation(
    UPDATE_FASTAG_REVERSE_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
      }
    }
  )
  const onSubmit = (form) => {
    setDisableButton(true)
    reverse_fastag({
      variables: {
        truckId: fastag.truck_id,
        partnerId: fastag.partner_id,
        tagId: fastag.tag_id,
        modifiedBy: context.email,
        reversalAmount: form.reversal_amount,
        token: token
      }
    })
    onHide()
  }

  return (
    <Modal
      title='Fastag Reversal'
      visible={visible}
      footer={null}
    >
      <Form layout='vertical' onFinish={onSubmit}>
        <Form.Item
          label='Reversal Amount'
          name='reversal_amount'
          initialValue={0}
        >
          <Input placeholder='Reversal Amount' />
          <p>Tag balance Amount:</p>
        </Form.Item>
        <Row justify='end'>
          <Col xs={24} className='text-right'>
            <Space>
              <Button>Cancel</Button>
              <Button type='primary' loading={disableButton} htmlType='submit'>Ok</Button>
            </Space>
          </Col>
        </Row>
      </Form>

    </Modal>
  )
}

export default FastagReversal
