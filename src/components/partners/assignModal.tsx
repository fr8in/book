import { Modal, Button, Select } from 'antd';
import React from 'react'


const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}
class AssignModal extends React.Component {
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
        <Button type="primary" onClick={this.showModal}>
          Assign
        </Button>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Select defaultValue="Owner" style={{ width: 300 }} onChange={handleChange}>
            <Option value="ravi@fr8.in">ravi@fr8.in</Option>
            <Option value="kaviya@fr8.in">kaviya@fr8.in</Option>
            <Option value="sourav@fr8.in">sourav@fr8.in</Option>
            <Option value="tharun@fr8.in">tharun@fr8.in</Option>
          </Select>
        </Modal>
      </div>
    );
  }
}

export default AssignModal