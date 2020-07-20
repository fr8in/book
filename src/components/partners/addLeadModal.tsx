import React from 'react'
import { Modal, Button, Input, Row, Col, Space, Select } from 'antd';
import { UserAddOutlined } from '@ant-design/icons'

const { TextArea } = Input;
const { Option } = Select;

function handleChange(value) {
    console.log(`selected ${value}`);
}
const onChange = e => {
    console.log(e);
};
class AddLeadModal extends React.Component {
    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
            value: '',
        });
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    render() {
        const { visible, loading } = this.state;

        return (
            <div>
                <Button type="primary" icon={<UserAddOutlined />} onClick={this.showModal} />
                <Modal
                    visible={visible}
                    title="Create Lead"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Submit
            </Button>,
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
}

export default AddLeadModal