import React from "react";
import { Modal, Button,Input } from "antd";

  const ReportEmail = (props) => {
    const { visible, onHide } = props

    return (
      <> 
       <Modal
      title="Statement Email"
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button > Close </Button>,
      <Button type="primary"> Send Email </Button>
       ]}
      >
         <Input placeholder='Your Email Address...' />
        </Modal>
      </>
    );
  }


export default ReportEmail;