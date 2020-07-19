import React from 'react'
import { Modal, Button, Row,InputNumber ,Col,Card, Space} from 'antd';
import LabelWithData from '../common/labelWithData'
import {PhoneOutlined, DeleteFilled } from '@ant-design/icons'

function onChange(value) {
    console.log('changed', value);
  }
class PhoneModal extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
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
               
        </Button >
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
            <Card>
            <LabelWithData
					label='Mobile No'
					data={
						<Space>
							<span>Action</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='9889758643'
					data={
						<Space>
							<span><PhoneOutlined /> <DeleteFilled /></span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
                </Card>
            <Row>
            <Col span={17}>
            <InputNumber  min={-10} max={10} defaultValue={3} onChange={onChange} placeholder='Enter Mobile Number'/>
            </Col>
            <Col sm={{span:1 ,offset:1}} >
            <Button type="primary"> Add User </Button>
            </Col>
            </Row>
        
        </Modal>
      </div>
    );
  }
}

 export default PhoneModal