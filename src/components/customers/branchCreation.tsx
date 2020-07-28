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
  Input,
} from "antd";
import { DeleteTwoTone } from "@ant-design/icons";

const regionList = [
  { value: "North" },
  { value: "East" },
  { value: "South" },
  { value: "West" },
  { value: "others" },
];

const cusType = [
  { value: "Transporter" },
  { value: "Broker" },
  { value: "Shipper" },
  { value: "Enterprice" },
];

const { Option } = Select;
const BranchCreation = (props) => {
  const { visible, onHide, data, title } = props;

  const onSubmit = () => {
    console.log("Traffic Added", data);
    onHide();
  };
  const styles = {
    formCityLayout: {
      labelCol: { span: 24 },
      wrapperCol: { span: 22 },
    },
    formAddressLayout: {
      labelCol: { span: 24 },
      wrapperCol: { span: 23 },
    },
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Create Branch"
        onOk={onSubmit}
        onCancel={onHide}
        style={{ top: 20 }}
        width={450}
        footer={[
          <Button key="back" onClick={onHide}>
            Cancel
          </Button>,
          <Button type="primary" key="submit">
            Create Branch & Approve
          </Button>,
        ]}
      >
        <Form>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Select size="middle" placeholder="Region" options={regionList} />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Input placeholder="Head Office" disabled={true} />
            </Col>
          </Row>
          &nbsp;
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Input placeholder="Name" />
            </Col>
            &nbsp;
            <Col xs={{ span: 24 }} sm={{ span: 11 }}>
              <Select
                size="middle"
                placeholder="Customer Type ...."
                options={cusType}
              />
            </Col>
          </Row>
          &nbsp;
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 7 }}>
              <Input placeholder="Building Number" />
            </Col>
            &nbsp;
            <Col xs={{ span: 24 }} sm={{ span: 16 }}>
              <Input placeholder="Address" />
            </Col>
          </Row>
          &nbsp;
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 9 }}>
              <Input />
            </Col>
            &nbsp;
            <Col xs={{ span: 24 }} sm={{ span: 8 }}>
              <Input />
            </Col>
            &nbsp;
            <Col xs={{ span: 24 }} sm={{ span: 6 }}>
              <Input placeholder="Pincode" />
            </Col>
          </Row>
          &nbsp;
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Select size="middle" placeholder="OnBoarded By" options={data} />
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Select
                size="middle"
                placeholder="Select Payment Manager"
                options={data}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default BranchCreation;
