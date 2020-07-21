import React from 'react'
import { Modal, Button, Input, Row, Col, Space, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

function handleChange(value) {
    console.log(`selected ${value}`);
}
const onChange = e => {
    console.log(e);
};
const CreateLead = (props) => {
    const { visible, onHide } = props

    const onSubmit = () => {
      console.log('data Transfered!')
      onHide()
    }
        return (
            <div>
                <Modal
                    title="Create Lead"
                    visible={visible}
                    onOk={onSubmit}
                    onCancel={onHide}
                    footer={[
                    <Button type="primary"> Submit </Button>
                    ]}
                    >
                    <Input placeholder='Company Name' />
                    <br />
                    <br />
                    <Input placeholder=' Name' />
                    <br />
                    <br />
                    <Row>
                        <Space>
                            <Col >
                                <Input placeholder='Phone' />
                            </Col>
                            <Col >
                                <Select defaultValue="" style={{ width: 200 }} allowClear>
                                    <Option value=" "> </Option>
                                </Select>
                            </Col>
                        </Space>
                    </Row>
                    <br />
                    <Row>
                        <Space>
                            <Col >
                                <Select defaultValue="Select Source" style={{ width: 200 }} onChange={handleChange}>
                                    <Option value="App">App</Option>
                                    <Option value="Direct">Direct</Option>
                                    <Option value="Refferal">Refferal</Option>
                                    <Option value="Social Media">Social Media</Option>
                                    <Option value="Track">Track</Option>
                                </Select>
                            </Col>
                            <Col>
                                <Select defaultValue="Select Owner" style={{ width: 200 }} onChange={handleChange}>
                                    <Option value="Ravi">Ravi</Option>
                                    <Option value="Kaviya">Kaviya</Option>
                                    <Option value="Sourav">Sourav</Option>
                                    <Option value="Tharun">Tharun</Option>
                                    <Option value="Aswin">Aswin</Option>
                                </Select>
                            </Col>
                        </Space>
                    </Row>
                    <br />
                    <TextArea placeholder="Comment" allowClear onChange={onChange} />

                </Modal>
            </div>
        );
    }


export default CreateLead