import { Modal, Button, Form, Input, Select, Row, Space } from "antd";
import React from "react";
import { QuestionCircleTwoTone } from "@ant-design/icons";

const { Option } = Select;

const FastagReversal = (props) => {
  const { visible, onHide } = props;

  const onSubmit = () => {
    console.log("branch Added!");
    onHide();
  };

  return (
    <Modal
      title="Fastag Reversal"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Form layout="vertical">
        <Form.Item
          name="Reversal Amount"
          label="Reversal Amount"
          rules={[{ required: true }]}
        >
          <Input placeholder="Reversal Amount" />
          <p>Tag balance Amount:</p>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FastagReversal;
