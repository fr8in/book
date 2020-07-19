import { Modal, Button , Row, Col , DatePicker, Select, Space, Input} from 'antd';
import React from 'react'
import { EditTwoTone } from '@ant-design/icons'

const { Option } = Select;
const { TextArea } = Input;

function handleChange(value) {
    console.log(`selected ${value}`);
  }
  

class editModal extends React.Component {
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
        <EditTwoTone />
        </Button>
        <Modal
          title="Breakdown"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        <Row>
            <Space>
      <Col>
      <p>Available Date</p>
      </Col>
      <Col>
      <p> Current City</p>
      </Col>
      </Space>
        </Row>
        <Row>
            <Space>
            <Col>
            <DatePicker
                                showTime
                                name="selectSearchDate"
                                format="YYYY-MM-DD"
                                className="selectSearchdate1"
                                placeholder="Select Date"/>
        
            </Col>
            <Col>
            <Select defaultValue="Chennai" style={{ width: 120 }} onChange={handleChange}>
      <Option value="Coimbatore">Coimbatore</Option>
      <Option value="Madurai">Madurai</Option>
      <Option value="Trichy">Trichy</Option>
      </Select>
            </Col>
            </Space>
        </Row>
        <br/>
        <TextArea
          placeholder="Enter Comment"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
    </Modal>
      </div>
    );
  }
}

export default editModal