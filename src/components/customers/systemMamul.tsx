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

import Mamul from "../../../mock/customer/systemMamul";

const { Option } = Select;
const SystemMamul = (props) => {
  const { visible, onHide, data, title } = props;

  const onSubmit = () => {
    console.log("Traffic Added", data);
    onHide();
  };

  const SystemMamul = [
    {
      title: "",
      dataIndex: "rowName",
    },
    {
      title: "Billed",
      dataIndex: "billed",
    },
    {
      title: "Mamul",
      dataIndex: "mamul",
    },
    {
      title: "WriteOff",
      dataIndex: "writeOff",
    },
    {
      title: "Balance[60-120]",
      dataIndex: "bal",
    },
    {
      title: "Balance[120-180]",
      dataIndex: "bal",
    },
    {
      title: "Balance[>180]",
      dataIndex: "bal",
    },
    {
      title: "System Mamul",
      dataIndex: "bal",
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        title="System Mamul"
        onOk={onSubmit}
        onCancel={onHide}
        footer={[]}
      >
        <Table
          columns={SystemMamul}
          dataSource={Mamul}
          size="small"
          tableLayout="fixed"
        />
      </Modal>
    </>
  );
};

export default SystemMamul;
