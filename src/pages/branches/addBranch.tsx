import { Modal, Button, Form, Input, Select, Row, Space } from "antd";
import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
class AddBranch extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <Button type="primary" size="small" onClick={this.showModal}>
          <PlusCircleOutlined /> Add Branch
        </Button>
        <Modal
          title="Add Branch"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
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
  }
}

export default AddBranch;
