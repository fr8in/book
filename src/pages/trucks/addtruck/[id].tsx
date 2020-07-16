import React from 'react'
import { Row, Col, Card, Input,Button, Form} from 'antd';


function AddTruck() {
    return (
        <div>
            <Row gutter={[12, 12]}>
            <Col >
                    <h1> Singh</h1> 
                    
                    </Col>
            </Row>
            <Card >
                <h4><b>Truck Detail</b></h4><br />
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={5}>
                        <Row >
                            <Form.Item
                                label="Truck Number"
                                name="Truck Number"
                                rules={[{ required: true, message: 'Truck Number is required field!' }]}
                            >
                                <Input placeholder="Truck Number" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Current City"
                                name="Current City"
                                rules={[{ required: true, message: 'Current City is required field!' }]}
                            >
                                <Input placeholder="Current City" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Driver Number"
                                name="Driver Number"
                                rules={[{ required: true, message: 'Driver Number is required field' }]}
                            >
                                <Input placeholder="Driver Number" />
                            </Form.Item> </Row>
                    </Col>
                    </Row>

                    <Row gutter={[12, 12]}>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Truck Type"
                                name="Truck Type"
                                rules={[{ required: true, message: 'Truck Type is required field' }]}
                            >
                                <Input placeholder="Truck Type" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Length(Ft)"
                                name="Length(Ft)"
                                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
                            >
                                <Input placeholder="Length(Ft)" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Breadth(Ft)"
                                name="Breadth(Ft)"
                                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
                            >
                                <Input placeholder="Breadth(Ft)" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Height(Ft)"
                                name="Height(Ft)"
                                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
                            >
                                <Input placeholder="Height(Ft)" />
                            </Form.Item> </Row>
                    </Col>
                    </Row>
                    
            </Card>
            <Row justify="end" className="m5">
                
                <Col flex="100px">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Col>
                <Col flex="100px">
                    <Button >
                        Cancel
                    </Button>
                </Col>
            </Row>
            </div>
    )
}

export default AddTruck