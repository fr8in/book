import React from "react";
import { Modal, Button, Input,Form,Row,Col, Select } from "antd";
import { CarOutlined } from "@ant-design/icons";

const  Option= Select;
class QuickPo extends React.Component {
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
          <CarOutlined />
        </Button>
        <Modal
          visible={visible}
          title="Create Excess Load"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="Create"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >Create
            </Button>,
          ]}
        >
          <Form layout='vertical'>
        <Row gutter={10}>
               <Col xs={18}>
                 <Form.Item label='Customer'>
                   <Input
                  placeholder='Customer'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              </Row> 
              <Row gutter={10}>
              <Col xs={10}>
                <Form.Item label='Source'>
                  <Input
                  placeholder='Source'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={10} offset={3}>
                <Form.Item label='Destination'>
                  <Input
                  placeholder='Destination'
                      style={{ width: '100%' }}
                      disabled={false}
                    />  
                </Form.Item>
              </Col>
              </Row> 
            <Row gutter={10}>
              <Col xs={8}>
                <Form.Item label='Price'>
                  <Input
                  placeholder='Price'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Ton'>
                  <Input
                  placeholder='Ton'
                      style={{ width: '100%' }}
                      disabled={false}
                    />  
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Truck Type'>
                   <Input.Group compact>
                     <Select  style={{ width: '100%' }} defaultValue="32 Feet Multi Axle">
                     <Option value="32 Feet Multi Axle">32 Feet Multi Axle</Option>
                     <Option value="32 Feet Single Axle">32 Feet Single Axle</Option>
                     </Select> 
                      </Input.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24}>
                <Form.Item label='Comments'>
                  <Input
                  placeholder='Please enter Material Type or Tons'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              </Row>    
        </Form>
        </Modal>
      </>
    );
  }
}

export default QuickPo;
