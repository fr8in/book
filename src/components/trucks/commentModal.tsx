import { Modal, Button , Input } from 'antd';
import React from 'react'
import { MessageOutlined  } from '@ant-design/icons'

class timelineModal extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <Button onClick={this.showModal}>
        <MessageOutlined />
        </Button>
        <Modal
          title="Add Comment"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Comment</p>
          <Input placeholder="Enter Comments" />
        </Modal>
      </div>
    );
  }
}

export default timelineModal