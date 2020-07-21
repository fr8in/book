import { Modal, Button,Row,Col,Form,Input } from 'antd';
import React from 'react'

const CustomerPrice = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

    return (
      <div>
          <Modal
      title="Customer Price Change - Advance(90%): 25200"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button > Cancel </Button>,
      <Button type="primary"> Update </Button>
       ]}
      >
          <Form layout='vertical'>
                    <Row gutter={10}>
                        <Col sm={12}>
                            <Form.Item
                                label="Customer Price"
                                name="Customer Price"
                                rules={[{ required: true, message: 'Customer Price is required field!' }]}
                            >
                                <Input placeholder="28000" />
                            </Form.Item>
                        </Col>
                        <Col sm={12}>
                            <Form.Item
                                label="Mamul Charge"
                            >
                                <Input placeholder="700" />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row gutter={10}>
                        <Col sm={8}>
                            <Form.Item
                                label="Bank"
                                name="Bank"
                                rules={[{ required: true, message: 'Bank value is required field!' }]}
                            >
                                <Input placeholder="25500" />
                            </Form.Item>
                        </Col>
                        <Col sm={8}>
                            <Form.Item
                                label="Cash"
                                name="Cash"
                                rules={[{ required: true, message: 'Cash is required field!' }]}
                            >
                                <Input placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col sm={8}>
                            <Form.Item
                                label="To-Pay"
                                name="To-Pay"
                                rules={[{ required: true, message: 'To-Pay is required field!' }]}
                            >
                                <Input placeholder="0" />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row gutter={10}>
                        <Col sm={24}>
                            <Form.Item
                                label="Comment"
                                name="Comment"
                                rules={[{ required: true, message: 'Comment value is required field!' }]}
                            >
                                <Input placeholder="Comment" />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row>
                          <h4>  Partner Price : 27300  </h4>
                        </Row>
          </Form>
        </Modal>
      </div>
    );
  }


export default CustomerPrice ;