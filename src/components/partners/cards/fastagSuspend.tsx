import { Modal, Button, Form, Input, Select, Row, Space } from "antd";
import React from "react";
import { QuestionCircleTwoTone } from "@ant-design/icons";

const { Option } = Select;

const FastagSuspend = (props) => {
  const { visible, onHide } = props;

  const onSubmit = () => {
    console.log("branch Added!");
    onHide();
  };

  return (
    <Modal visible={visible} onOk={onSubmit} onCancel={onHide}>
      <br />
      <h3>
        <QuestionCircleTwoTone twoToneColor="#ffc107" /> Suspended Tags will get
        permanently deactivated. This action cannot be undone
      </h3>
      <br />
      <p>Do you want to proceed?</p>
    </Modal>
  );
};

export default FastagSuspend;
