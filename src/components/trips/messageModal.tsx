import React from "react";
import { Modal, Button, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

class MessageModal extends React.Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <>
       <Button type="primary" size="small" onClick={this.showModal} shape='circle' icon={<MailOutlined />} />
        <Modal
          visible={visible}
          title="Loading Memo Email"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Send
            </Button>
          ]}
        >
          <Input placeholder="Email Address" />
        </Modal>
      </>
    );
  }
}

export default MessageModal;