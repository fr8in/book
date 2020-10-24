import React from 'react'
import { Modal, Button, Input } from 'antd'

const AccStatementMail = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    onHide()
  }

  return (
    <Modal
      visible={visible}
      title='Account Statement'
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

export default AccStatementMail
