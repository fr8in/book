import React from "react";
import { Row, Col, Radio, Card, Input, Form, Button, Select } from "antd";
const RadioGroup = Radio.Group;

function PartnerProfile() {
  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <Col flex="180px">
        <Row>
          <Form.Item
            label="Tag Id"
            name="Tag Id"
            rules={[
              {
                required: true,
                message: "Tag Id is required field!",
              },
            ]}
          >
            <Input placeholder="Tag Id" />
          </Form.Item>{" "}
        </Row>
      </Col>
      <Col flex="180px">
        <Row>
          <Form.Item
            label="Partner"
            name="Partner"
            rules={[
              {
                required: true,
                message: "Partner is required field!",
              },
            ]}
          >
            <Input placeholder="Select Partner" />
          </Form.Item>{" "}
        </Row>
      </Col>
      <Col flex="180px">
        <Row>
          <Form.Item
            label="Confirm Tag Id"
            name="Confirm Tag Id"
            rules={[
              {
                required: true,
                message: "Confirm Tag Id is required field",
              },
            ]}
          >
            <Input placeholder="Confirm Tag Id" />
          </Form.Item>{" "}
        </Row>
      </Col>
      <Col flex="180px">
        <Row>
          <Form.Item
            label="Truck Number"
            name="Truck Number"
            rules={[{ required: true, message: "Email is required field" }]}
          >
            <Input placeholder="Truck Number" />
          </Form.Item>{" "}
        </Row>
      </Col>
      <Col flex="130px">
        <Row className="m5">
          <Button type="primary">Submit</Button>
        </Row>
      </Col>
      <Col flex="130px">
        <Row className="m5">
          <Button>Cancel</Button>
        </Row>
      </Col>
    </div>
  );
}
export default PartnerProfile;
