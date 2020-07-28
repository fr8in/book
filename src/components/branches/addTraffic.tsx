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
} from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import TrafficMock from "../../../mock/card/cards";

const { Option } = Select;
const StatementMail = (props) => {
  const { visible, onHide, data, title } = props;

  const onSubmit = () => {
    console.log("Traffic Added", data);
    onHide();
  };

  const Traffic = [
    {
      title: "BM.Traffic",
      dataIndex: "bmTraffic",
      render: (text, record) => {
        return (
          <span>
            <Radio>{text}</Radio>
          </span>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      render: () => <DeleteTwoTone twoToneColor="#eb2f96" />,
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        title={` ${title} Traffic`}
        onOk={onSubmit}
        onCancel={onHide}
        footer={[]}
      >
        <Form.Item>
          <Form.Item rules={[{ required: true }]}>
            <Row justify="start" className="m5">
              <Col flex="350px">
                <Select size="middle">
                  <Option value="Not Found">Not Found</Option>
                </Select>
              </Col>
              &nbsp;
              <Col>
                <Button
                  key="submit"
                  type="primary"
                  size="middle"
                  onClick={onSubmit}
                >
                  Add Traffic
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form.Item>

        <Table
          columns={Traffic}
          dataSource={TrafficMock}
          size="small"
          tableLayout="fixed"
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default StatementMail;
