import React from "react";
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Table,
  Radio,
  Col,
  Badge,
  Input,
  Divider,
  Space,
} from "antd";
import { EyeTwoTone } from "@ant-design/icons";
import { DatePicker } from "antd";

function onChange(date, dateString) {
  console.log(date, dateString);
}

const { Option } = Select;
const TruckActivation = (props) => {
  const { visible, onHide, data, title } = props;

  const onSubmit = () => {
    console.log("Traffic Added", data);
    onHide();
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Truck Activation"
        onOk={onSubmit}
        onCancel={onHide}
        width="40%"
        footer={[
          <Button type="primary" key="submit" onClick={onSubmit}>
            Activate Truck
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item>
            <Row className="labelFix">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <h4>TruckNo:</h4>
              </Col>

              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                style={{
                  textAlign: "right",
                }}
              >
                <h4>Height:</h4>
              </Col>
            </Row>
            <Divider />
            <Row className="labelFix">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Form.Item
                  label="Truck Type"
                  name="Truck Type"
                  rules={[{ required: true }]}
                  style={{ width: "70%" }}
                >
                  <Select placeholder="Select TruckType" allowClear>
                    <Option value="Not Found">Not Found</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Form.Item label="RC" name="RC" className="hideLabel">
                  <h4>RC</h4>
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                style={{
                  textAlign: "right",
                }}
              >
                <Form.Item label="doc" name="doc" className="hideLabel">
                  <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    icon={<EyeTwoTone />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="labelFix">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Form.Item label="Available From" name="Available From">
                  <DatePicker onChange={onChange} />
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Form.Item label="screed" name="screen" className="hideLabel">
                  <h4>Vaahan Screen</h4>
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                style={{
                  textAlign: "right",
                }}
              >
                <Form.Item label="doc" name="doc" className="hideLabel">
                  <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    icon={<EyeTwoTone />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="labelFix">
              <Col flex="150px">
                <Form.Item label="On-Boarded By" name="On-Boarded By">
                  <Input placeholder="On-BoardedBy" />
                </Form.Item>
              </Col>
              &nbsp;
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Form.Item
                  label="Available City"
                  name="Available City"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select AvailableCity" allowClear>
                    <Option value="Not Found">Not Found</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <label>
                  New vehicle on-boarded
                  <br />
                  Partner Name: <br />
                  ft
                  <br />
                  Available In <br />
                  On-boarded by
                </label>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TruckActivation;
