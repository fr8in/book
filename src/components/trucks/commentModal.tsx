import React from "react";
import { Modal, Button, Input } from "antd";

  const CommentModal = (props) => {
    const { visible, onHide } = props

    const onSubmit = () => {
      console.log('data Transfered!')
      onHide()
    }

    return (
      <> 
       <Modal
      title="Add Comment"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button type="primary"> Submit </Button>
       ]}
      >
      <p><label>Comment</label></p>  
          <Input placeholder="Enter Comments" />
        </Modal>
      </>
    );
  }


export default CommentModal;