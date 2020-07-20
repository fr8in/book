import React from 'react';
import { Row, Col, Radio, Card, Input, Form, Button, Select } from 'antd';


const RadioGroup = Radio.Group
function PartnerProfile() {
    return (
        <div>
            <Card title="Create Partner" className='card-body-0 border-top-blue'>
                <br />
                <h4><b>Personal Details</b></h4><br />
                <Form layout='vertical'>
                    <Row gutter={10}>
                        <Col sm={5}>
                            <Form.Item
                                label="Partner Name (Should be RC name)"
                                name="Partner Name (Should be RC name)"
                                rules={[{ required: true, message: 'Partner Name(Should be RC name) is required field!' }]}
                            >
                                <Input placeholder="PartnerName" />
                            </Form.Item>
                        </Col>
                        <Col sm={5}>
                            <Form.Item
                                label="Contact Person"
                                name="Contact Person"
                                rules={[{ required: true, message: 'Contact Person is required field!' }]}
                            >
                                <Input placeholder="Contact Person" />
                            </Form.Item>
                        </Col>
                        <Col sm={5}>
                            <Form.Item
                                label="Phone Number"
                                name="Phone Number"
                                rules={[{ required: true, message: 'Mobile Number is required field' }]}
                            >
                                <Input placeholder="Phone Number" />
                            </Form.Item>
                        </Col>
                        <Col sm={5}>
                            <Form.Item
                                label="Email Address"
                                name="Email Address"
                                rules={[{ required: true, message: 'Email is required field' }]}
                            >
                                <Input placeholder="Email Address" />
                            </Form.Item>
                        </Col>
                        <Col sm={4}>
                            <Form.Item
                                label="Pan Number"
                                name="Pan Number"
                                rules={[{ required: true, message: 'Pan Number is required field' }]}
                            >
                                <Input placeholder="Pan Number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={10}>

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
                                    rules={[{ required: true, message: 'Cibil Score is required field!' }]}
                                >
                                    <Input placeholder="Cibil Score " />
                                </Form.Item> </Row>

                        </Col>
                        <Col xs={24} sm={4}>
                            <Row >
                                <Form.Item
                                    label="Building Number"
                                    name="Building Number"
                                    rules={[{ required: true, message: 'Building Number is required field!' }]}
                                >
                                    <Input placeholder="Building Number" />
                                </Form.Item> </Row>
                        </Col>
                        <Col xs={24} sm={4}>
                            <Row >
                                <Form.Item
                                    label="Address"
                                    name="Address"
                                    rules={[{ required: true, message: 'Address is required field!' }]}
                                >
                                    <Input placeholder="Address" />
                                </Form.Item> </Row>
                        </Col>
                        <Col xs={24} sm={{ span: 4, offset: 6 }} >
                            <Row >
                                <Form.Item
                                    label="Zip Code"
                                    name="Zip Code"
                                    rules={[{ required: true, message: 'Zip Code is required field' }]}
                                >
                                    <Input placeholder="Zip Code" />
                                </Form.Item> </Row>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <br />
            <br />
            <Card size='small' className='card-body-0 border-top-blue'>
                <br />
                <h4><b>Bank Details</b></h4><br />
                <Form layout='vertical'>
                    <Row gutter={10} >
                        <Col xs={5} >
                            <Form.Item
                                label="Account Holder Name"
                                name="Account Holder Name"
                                rules={[{ required: true, message: 'Account Holder Name is required field!' }]}
                            >
                                <Input placeholder="Address" />
                            </Form.Item>
                        </Col>
                        <Col xs={5}>
                            <Form.Item
                                label="Account No"
                                name="Account No"
                                rules={[{ required: true, message: 'Account No is required field!' }]}
                            >
                                <Input placeholder="Account No" />
                            </Form.Item>
                        </Col>
                        <Col xs={5}>
                            <Form.Item
                                label="Re-enter Account No"
                                name="Re-enter Account No"
                                rules={[{ required: true, message: 'Re-enter Account No is required field!' }]}
                            >
                                <Input placeholder="Confirm Account No" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col xs={5}>
                            <Form.Item
                                label="IFSC Code"
                                name="IFSC Code"
                                rules={[{ required: true, message: 'IFSC Code is required field!' }]}
                            >
                                <Input placeholder="IFSC Code" />
                            </Form.Item>
                        </Col>
                        <Col xs={5} >
                            <Form.Item
                                label="Bank Name"
                            >
                                <Input placeholder="Bank Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={5}>
                            <Form.Item
                                label="Branch Name"
                            >
                                <Input placeholder="Branch Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <br />
            <br />
            <Card size='small' className='card-body-0 border-top-blue'>
                <br />
                <h4><b>FR8 Details</b></h4><br />
                <Form layout='vertical'>
                    <Row gutter={10} >
                        <Col xs={5} >
                            <Form.Item label="Advance Percentage" name="Advance Percentage"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="Advance Percentage" disabled> </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={5} >
                            <Form.Item
                                label="Region"
                                name="Region"
                                rules={[{ required: true, message: 'Region is required field!' }]}
                            >
                                <Select>
                                    <Select.Option value="Region"> </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={4} >
                            <Form.Item
                                label="City"
                                name="City"
                                rules={[{ required: true, message: 'City is required field!' }]}
                            >
                                <Select>
                                    <Select.Option value="City"> </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={5}  >
                            <Form.Item
                                label="On Boarded By"
                                name="On Boarded By"
                                rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
                            >
                                <Select>
                                    <Select.Option value="On Boarded By"> </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={5}  >
                            <Form.Item
                                label="Lane Manager"
                            >
                                <Select>
                                    <Select.Option value="Lane Manager"> </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <br />
            <Row justify="end" className="m5">
                <Col flex="100px">
                    <Button >
                        Cancel
                    </Button>
                </Col>
                <Col flex="100px">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Col>
            </Row>



        </div>
    )
}
export default PartnerProfile
