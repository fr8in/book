import { Modal, Button, Input, Row, Form, Space, message } from 'antd'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'
import u from '../../lib/util'


const UPDATE_PARTNER_BANK_MUTATION = gql`
mutation update_account_no($id: Int!, $account_number: String!, $account_holder: String!, $ifsc_code: String!, $updated_by: String!,$partner_comment:PartnerCommentInput) {
  update_account_no(id: $id, account_number: $account_number, account_holder: $account_holder, ifsc_code: $ifsc_code, updated_by:$updated_by,partner_comment:$partner_comment) {
    description
    status
  }
}`

const IFSC_VALIDATION = gql`
query ifsc_validation($ifsc: String!){
  bank_detail(ifsc: $ifsc) {
    bank
    bankcode
    branch
  }
}`

const { TextArea } = Input

const EditBank = (props) => {
  const { visible, onHide, partner_id,partner_info } = props
  const { topic } = u

  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  const [form] = Form.useForm()

  const [getBankDetail, { loading, data, error }] = useLazyQuery(
    IFSC_VALIDATION,
    {
      onError (error) {
        message.error(`Invalid IFSC: ${error}`)
        form.resetFields(['ifsc_code'])
      },
      onCompleted (data) {
        message.info(`Bank name: ${get(data, 'bank_detail.bank', '')}!!`)
      }
    }
  )

  const [updatePartnerBank] = useMutation(
    UPDATE_PARTNER_BANK_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        const description = get(data, 'update_account_no.description', null)
        const status = get(data, 'update_account_no.status', null)
        if (status === 'OK') {
          message.success(description || 'Updated!!')
          onHide()
        } else {
          message.error(description || 'Error Occured!!')
        }
      }
    }
  )

  const validateIFSC = () => {
    if (form.getFieldValue('ifsc_code')) {
      getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc_code').trim() } })
    } else return null
  }

  const onBankSubmit = (form) => {
    setDisableButton(true)
    updatePartnerBank({
      variables: {
        id: partner_id,
        account_number: form.account_number,
        account_holder: form.account_holder,
        ifsc_code: form.ifsc_code,
        updated_by: context.email,
        partner_comment: {
          description: form.comment,
          topic: topic.partner_bank_detail
        }
      }
    })
  }

  return (
    <>
      <Modal
        title='Edit Bank'
        visible={visible}
        onCancel={onHide}
        footer={null}
      >
        <Form layout='vertical' onFinish={onBankSubmit} form={form}>
          <Form.Item
            name='account_holder'
            rules={[{ required: true }]}
            initialValue={get(partner_info, 'account_holder', null)}
          >
            <Input placeholder='Account_Holder Name' />
          </Form.Item>
          <Form.Item
            name='ifsc_code'
            rules={[{ required: true }]}
            initialValue={get(partner_info, 'ifsc_code', null)}
          >
            <Input placeholder=' IFSC Code' onBlur={validateIFSC} maxLength={11}/>
          </Form.Item>
          <Form.Item
            name='account_number'
            rules={[{ required: true }]}
            initialValue={get(partner_info, 'display_account_number', null)}
          >
            <Input placeholder=' Account Number' />
          </Form.Item>
          <Form.Item
            name='comment'
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder='Enter Reason'
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>


          <Row justify='end'>
            <Space>
              <Button type='primary' loading={disableButton} htmlType='submit'>Save</Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default EditBank
