import { Modal, Button, Form, Input, Select, Row, Space } from "antd";
import React from "react";

const { Option } = Select;

const AddBranch = (props) => {
  const { visible, onHide } = props;

  const onSubmit = () => {
    console.log("branch Added!");
    onHide();
  };

  return (
    <div>
      <Modal
        title="Add Branch"
        visible={visible}
        onOk={onSubmit}
        onCancel={onHide}
      >
        <div>
          <Form.Item>
            <Input placeholder="Branch Name" />
          </Form.Item>
          <Form.Item>
            <Select placeholder="Branch Manager" allowClear>
              <Option value="Not Found">Not Found</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Select placeholder="Traffic Coordinator" allowClear>
              <Option value="Not Found">Not Found</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Input placeholder="Display Position" />
          </Form.Item>
        </div>
      </Modal>
    </div>
  );
};

export default AddBranch;
