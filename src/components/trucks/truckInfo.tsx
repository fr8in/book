import React from 'react'
import {Row,Col,Input,Form} from 'antd'
export default function truckInfo() {
    return (
        <div>
            <Row gutter={[12, 12]}>
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
        </div>
    )
}
                                           
                
                                    