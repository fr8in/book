import React from 'react'
import { Modal, Button, Input } from 'antd'

const ReportEmail = (props) => {
  const { visible, onHide } = props

  return (
    <Modal
      title='Account Statement'
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button key='back'> Close </Button>,
        <Button type='primary' key='send'> Send Email </Button>
      ]}
    >
      <Input placeholder='Your Email Address...' />
    </Modal>
  )
}

export default ReportEmail
