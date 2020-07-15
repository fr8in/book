import React from 'react';
import { Row, Col, Radio, Card, Input, Form } from 'antd';
const RadioGroup = Radio.Group


function PartnerProfile() {
    return (
        <div>
            <Card title="Create Partner">
                <h4><b>Personal Details</b></h4><br />
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={5}>
                         <Row >
                            <Form.Item
                                label="Partner Name (Should be RC name)"
                                name="Partner Name (Should be RC name)"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="PartnerName" />
                            </Form.Item> </Row> 
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Conatct Person"
                                name="Conatct Person"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Contact Person" />
                            </Form.Item> </Row> 
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Phone Number"
                                name="Phone Number"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Phone Number" />
                            </Form.Item> </Row> 
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Email Address"
                                name="Email Address"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Email Address" />
                            </Form.Item> </Row>

                    </Col>
                    <Col xs={24} sm={4}>
                       <Row >
                            <Form.Item
                                label="Pan Number"
                                name="Pan Number"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Pan Number" />
                            </Form.Item> </Row>

                    </Col>
                </Row>
                <Row gutter={[12, 12]}>

                    <Col xs={24} sm={{ span: 3 }} >
                        <h4><b>Auto Final Payment</b></h4><br />
                        <RadioGroup >
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </RadioGroup>
                    </Col>
                    <Col xs={24} sm={3}>

                        <Row >
                            <Form.Item
                                label="Cibil Score"
                                name="Cibil Score"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Cibil Score " />
                            </Form.Item> </Row>

                    </Col>
                    <Col xs={24} sm={3}>
                        <Row >
                            <Form.Item
                                label="Building Number"
                                name="Building Number"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Building Number" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Address"
                                name="Address"
                                rules={[{ required: true, message: 'Address' }]}
                            >
                                <Input placeholder="Address" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={{ span: 4, offset: 7 }} >
                        <Row >
                            <Form.Item
                                label="Zip Code"
                                name="Zip Code"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Zip Code" />
                            </Form.Item> </Row>

                    </Col>

                </Row>
            </Card>
            <br />
            <Card>
                <h4><b>Bank Details</b></h4><br />
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={4}>
                       
                            <Row >
                                <Form.Item
                                    label="Account Holder Name"
                                    name="Account Holder Name"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Address" />
                                </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>

                        <Row >
                            <Form.Item
                                label="Account No"
                                name="Account No"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Account No" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Row >
                            <Form.Item
                                label="Re-enter Account No"
                                name="Re-enter Account No"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Confirm Account No" />
                            </Form.Item> </Row>
                    </Col>
                </Row>
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={4}>

                        <Row >
                            <Form.Item
                                label="IFSC Code"
                                name="IFSC Code"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="IFSC Code" />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>
                    <Row >
                            <Form.Item
                                label="Bank Name"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Bank Name"/>
                            </Form.Item> </Row>

                    </Col>
                    <Col xs={24} sm={4}>
                    <Row >
                            <Form.Item
                                label="Branch Name"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Branch Name"/>
                            </Form.Item> </Row>
                    </Col>
                </Row>
            </Card>
            <br />
            <Card>
                <h4><b>FR8 Details</b></h4><br />
                <Row gutter={[12, 12]}>

                    <Col xs={24} sm={5}>

                        <Row >
                            <Form.Item
                                label="Advance Percentage"
                                name="Advance Percentage"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>

                        <Row >
                            <Form.Item
                                label="Region"
                                name="Region"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={3}>

                        <Row >
                            <Form.Item
                                label="City"
                                name="City"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>

                        <Row >
                            <Form.Item
                                label="On Boarded By"
                                name="On Boarded By"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item> </Row>
                    </Col>
                    <Col xs={24} sm={4}>

                        <Row >
                            <Form.Item
                                label="Lane Manager"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item> </Row>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
export default PartnerProfile
