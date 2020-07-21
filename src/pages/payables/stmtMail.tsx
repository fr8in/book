import React from "react";
import { Modal, Button, Input } from "antd";
import { MailTwoTone } from "@ant-design/icons";

class StatementMail extends React.Component {
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
        <Button type="primary" size="small" onClick={this.showModal}>
          <MailTwoTone />
        </Button>
        <Modal
          visible={visible}
          title="Statement Email"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="small" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              size="small"
              onClick={this.handleOk}
            >
              Send Email
            </Button>,
          ]}
        >
          <Input placeholder="Your Email Address..." />
        </Modal>
      </>
    );
  }
}

export default StatementMail;
