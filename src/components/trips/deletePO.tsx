import React from "react";
import { Modal, Button } from "antd";

  const DeletePO = (props) => {
    const { visible, onHide } = props

    return (
      <> 
       <Modal
      title="Delete PO"
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button > No </Button>,
      <Button type="primary"> Yes </Button>
       ]}
      >
         Are you sure to Delete PO?
        </Modal>
      </>
    );
  }


export default DeletePO;