import React from 'react'
import { Modal, Button, Input } from 'antd'

const StatementMail = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('Mail sent!')
    onHide()
  }

  return (
    <Modal
      visible={visible}
      title='DownPayment Statement'
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button key='back' size='small' onClick={onHide}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' size='small' onClick={onSubmit}>
          Send Email
        </Button>
      ]}
    >
      <Input placeholder='Your Email Address...' />
    </Modal>
  )
}

export default StatementMail
