import React from "react";
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Input,
  Radio,
  Col,
  Badge,
  Divider,
  Checkbox,
} from "antd";
import { DeleteTwoTone, EyeTwoTone, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const KycApproval = (props) => {
  const { visible, onHide, data, title } = props;

  const onSubmit = () => {
    console.log("KYC Approved", data);
    onHide();
  };

  return (
    <>
      <Modal
        visible={visible}
        title="KYC Approval"
        onOk={onSubmit}
        onCancel={onHide}
        width="700px"
        footer={[
          <Button key="back" onClick={onHide}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={onSubmit}>
            Approve KYC
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item name="Partner Name:" label="Partner Name:">
                {data.name}
              </Form.Item>
            </Col>
            <Col flex="200px">
              <Form.Item name="Advance Percentage" label="Advance Percentage">
                <Select placeholder="Select Percentage" allowClear>
                  <Option value="Not Found">Not Found</Option>
                </Select>
              </Form.Item>
            </Col>
            &nbsp;
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item
                name="On-Boarded By"
                label="On-Boarded By"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Name" allowClear>
                  <Option value="Not Found">Not Found</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row>
            <h3>Documents</h3>
          </Row>
          <Divider />
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item
                name="PAN Document"
                label="PAN Document"
                rules={[{ required: true }]}
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <h4>{data.pan}</h4>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              style={{
                textAlign: "right",
              }}
            >
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<EyeTwoTone />}
              />
              &nbsp;
              <Button
                size="middle"
                shape="circle"
                icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item
                name="Cancelled Cheque/Passbook"
                label="Cancelled Cheque/Passbook"
                rules={[{ required: true }]}
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <h4>{data.accNo}</h4>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              style={{
                textAlign: "right",
              }}
            >
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<EyeTwoTone />}
              />
              &nbsp;
              <Button
                size="middle"
                shape="circle"
                icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item
                name="Agreement"
                label="Agreement"
                rules={[{ required: true }]}
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}></Col>

            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              style={{
                textAlign: "right",
              }}
            >
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<EyeTwoTone />}
              />
              &nbsp;
              <Button
                size="middle"
                shape="circle"
                icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item
                name="Cibil Score"
                label="Cibil Score"
                rules={[{ required: true }]}
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Input placeholder="CibilScore" />
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              style={{
                textAlign: "right",
              }}
            >
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<EyeTwoTone />}
              />
              &nbsp;
              <Button
                size="middle"
                shape="circle"
                icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Form.Item name="TDS" label="TDS" rules={[{ required: true }]} />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Radio>Applicable</Radio>
              <Radio>Not Applicable</Radio>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              style={{
                textAlign: "right",
              }}
            >
              <Button size="middle" shape="circle" icon={<UploadOutlined />} />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Checkbox>GST Applicable</Checkbox>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Input placeholder="GST Number" />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Checkbox>EMI</Checkbox>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <h4>Truck No</h4>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <h4>Type</h4>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <h4>{data.truckNo}</h4>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <h4>{data.type}</h4>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default KycApproval;
