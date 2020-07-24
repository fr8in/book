import { Modal, Form, Input } from 'antd'
import React from 'react'

const FastagReversal = (props) => {
  const { visible, onHide, data } = props

  const onSubmit = () => {
    console.log('Fastag Amount Reversed!', data)
    onHide()
  }

  return (
    <Modal
      title='Fastag Reversal'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Form layout='vertical'>
        <Form.Item
          label='Reversal Amount'
          rules={[{ required: true }]}
        >
          <Input placeholder='Reversal Amount' />
          <p>Tag balance Amount:</p>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FastagReversal
