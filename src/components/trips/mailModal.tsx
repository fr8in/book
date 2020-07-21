import React from "react";
import { Modal, Button, Input } from "antd";

  const MailModal = (props) => {
    const { visible, onHide } = props

    const onSubmit = () => {
      console.log('data Transfered!')
      onHide()
    }

    return (
      <> 
       <Modal
      title="Loading Memo Email"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button > Cancel </Button>,
      <Button type="primary"> Send </Button>
       ]}
      >
          <Input placeholder="Email Address" />
        </Modal>
      </>
    );
  }


export default MailModal;