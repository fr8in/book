import { Modal, Button, Input, Row, Form, Space, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'

const UPDATE_PARTNER_BANK_MUTATION = gql`
mutation update_account_no($id: Int!, $account_number: String!, $account_holder: String!, $ifsc_code: String!, $updated_by: String!) {
  update_account_no(id: $id, account_number: $account_number, account_holder: $account_holder, ifsc_code: $ifsc_code, updated_by:$updated_by) {
    description
    status
  }
}`

const EditBank = (props) => {
  const { visible, onHide, partner_id } = props

  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const [updatePartnerBank] = useMutation(
    UPDATE_PARTNER_BANK_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    }
  )
  const onBankSubmit = (form) => {
    setDisableButton(true)
    updatePartnerBank({
      variables: {
        id: partner_id,
        account_number: form.account_number,
        account_holder: form.account_holder,
        ifsc_code: form.ifsc_code,
        updated_by: context.email
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
        <Form layout='vertical' onFinish={onBankSubmit}>
          <Form.Item
            name='account_holder'
          >
            <Input placeholder='Name' />
          </Form.Item>
          <Form.Item
            name='account_number'
          >
            <Input placeholder=' Account Number' />
          </Form.Item>
          <Form.Item
            name='ifsc_code'
          >
            <Input placeholder=' IFSC Code' />
          </Form.Item>

          <Row justify='end'>
            <Space>
              <Button type='primary' key='back' loading={disableButton} htmlType='submit'>Save</Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default EditBank
