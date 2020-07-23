import React from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Select,
  Table,
  Row,
  Col,
  Space,
} from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import TrafficMock from "../../../mock/card/cards";

const { Option } = Select;
const StatementMail = (props) => {
  const { visible, onHide } = props;

  const onSubmit = () => {
    console.log("branch Added!");
    onHide();
  };

  const Traffic = [
    {
      title: "BM.Traffic",
      dataIndex: "bmTraffic",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      render: () => <DeleteTwoTone />,
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        title="Traffic"
        onOk={onSubmit}
        onCancel={onHide}
        footer={[]}
      >
        <Form.Item>
          <Col>
            <Select>
              <Option value="Not Found">Not Found</Option>
            </Select>
          </Col>
          <Col>
            <Button key="submit" type="primary" size="small" onClick={onSubmit}>
              Add Traffic
            </Button>
          </Col>
        </Form.Item>

        <Table
          columns={Traffic}
          dataSource={TrafficMock}
          size="small"
          tableLayout="fixed"
        />
      </Modal>
    </>
  );
};

export default StatementMail;
