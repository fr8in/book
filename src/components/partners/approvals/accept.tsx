import { Modal, Form, Input } from 'antd'
import React from 'react'

const Approve = (props) => {
  const { visible, onHide, data, title } = props

  const onSubmit = () => {
    console.log('Fastag Amount Reversed!', data)
    onHide()
  }

  return (
    <Modal title={title} visible={visible} onOk={onSubmit} onCancel={onHide}>
      <Form layout='vertical'>
        {title === 'Approved' && (
          <Form.Item label='Approved Amount' rules={[{ required: true }]}>
            <Input placeholder='Approved Amount' />
            <p>Claim Amount:</p>
          </Form.Item>
        )}
        <Form.Item label='Remarks' rules={[{ required: true }]}>
          <Input placeholder='Remarks' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Approve
