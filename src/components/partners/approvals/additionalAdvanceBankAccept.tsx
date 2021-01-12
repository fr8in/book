import { Modal, Form, Input, Button, message, Row, Col } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../lib/userContaxt'
import moment from 'moment'

const GET_TOKEN = gql`
query getToken($ref_id: Int!, $process: String!) {
    token(ref_id: $ref_id, process: $process)
  }
`
const REJECT_ADDITIONAl_ADVANCE_BANK = gql`mutation reject_additional_advance_bank($id: Int, $updated_by: String, $updated_at: timestamp) {
    update_advance_additional_advance(_set: {status: "REJECTED", updated_by: $updated_by, updated_at: $updated_at}, where: {id: {_eq: $id}}) {
      affected_rows
    }
  }`

const APPROVE_ADDITIONAL_ADVANCE_BANK = gql`mutation approve_additional_advance($input: AdditionalAdvanceBankInput) {
    additional_advance_bank(input: $input) {
      status
      description
      result {
          advance_result
      }
    }
  }`

const AdditionalAdvanceBankAccept = (props) => {
  const { visible, onHide, item_id, title } = props

  const context = useContext(userContext)
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)
  const trip_id = get(item_id, 'trip_id', null)

  const { data } = useQuery(GET_TOKEN, {
    fetchPolicy: 'network-only',
    variables: {
      ref_id: trip_id,
      process: 'ADDITIONAL_ADVANCE'
    }
  })
  const [approveTransfer] = useMutation(
    APPROVE_ADDITIONAL_ADVANCE_BANK,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'additional_advance_bank.status', null)
        const description = get(data, 'additional_advance_bank.description', null)
        const result = get(data, 'additional_advance_bank.result.advance_result', null)
        if (status === 'OK' && result === false) {
          setDisableButton(false)
          form.resetFields()
          message.success(description || 'Processed!')
          onHide()
        } else { (message.error(description)); setDisableButton(false); onHide() }
      }
    }
  )

  const [rejectTransfer] = useMutation(
    REJECT_ADDITIONAl_ADVANCE_BANK, {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Additional Advance to Bank Rejected')
        onHide()
      }
    })
  const onSubmit = (form) => {
    if (title === 'Approve') {
      setDisableButton(true)
      approveTransfer({
        variables: {
          input: {
            id: item_id.id,
            updated_by: context.email,
            token: data.token
          }
        }
      })
    } else {
      setDisableButton(true)
      rejectTransfer({
        variables: {
          id: item_id.id,
          updated_by: context.email,
          updated_at: moment().format('YYYY-MM-DD')

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
      <Form layout='vertical' onFinish={onSubmit} form={form}>
        <Row gutter={10}>
          <Col xs={11}>
            <Form.Item
              label='Account Name'
              name='account_name'
              initialValue={item_id.account_name}
              rules={[{ required: true, message: 'Account name required!' }]}
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={11}>
            <Form.Item
              label='Account Number'
              name='account_number'
              initialValue={item_id.account_number}
              rules={[{ required: true, message: 'Account number required!' }]}
            >
              <Input
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={11}>
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
          <Col xs={11}>
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
        </Row>
        <Form.Item className='text-right'>
          <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>{title === 'Approve' ? 'Approve' : 'Reject'}</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AdditionalAdvanceBankAccept
