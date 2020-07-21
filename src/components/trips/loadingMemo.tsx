import React from "react";
import { Modal, Button, Input } from "antd";

  const MailModal = (props) => {
    const { visible, onHide } = props

    return (
      <> 
       <Modal
      title="Loading Memo Email"
      visible={visible}
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