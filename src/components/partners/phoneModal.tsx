import React from 'react'
import { Modal, Button, Row,InputNumber ,Col,Card, Space,Divider,Typography} from 'antd';
import LabelWithData from '../common/labelWithData'
import {PhoneOutlined, DeleteOutlined } from '@ant-design/icons'

const {  Link} = Typography;
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
        <Link onClick={this.showModal}>
               9976742281
        </Link >
        <Modal
          title="IT sanjay - Users"
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
                <Divider />
				<LabelWithData
					label='9889758643'
					data={
						<Space>
							<span><PhoneOutlined /> <DeleteOutlined /></span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
                </Card>
                <br/>
            <Row>
            <Col span={16}>
            <InputNumber  min={-10} max={10} onChange={onChange} placeholder='Enter Mobile Number'/>
            </Col>
            <Col sm={{span:1 ,offset:2}} >
            <Button type="primary"> Add User </Button>
            </Col>
            </Row>
        
        </Modal>
      </div>
    );
  }
}
 export default PhoneModal