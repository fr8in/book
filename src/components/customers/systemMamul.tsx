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
      width: "5%",
    },
    {
      title: "Billed",
      dataIndex: "billed",
      width: "8%",
    },
    {
      title: "Mamul",
      dataIndex: "mamul",
      width: "9%",
    },
    {
      title: "WriteOff",
      dataIndex: "writeOff",
      width: "10%",
    },
    {
      title: "Balance[60-120]",
      dataIndex: "bal",
      width: "15%",
    },
    {
      title: "Balance[120-180]",
      dataIndex: "bal",
      width: "15%",
    },
    {
      title: "Balance[>180]",
      dataIndex: "bal",
      width: "13%",
    },
    {
      title: "System Mamul",
      dataIndex: "bal",
      width: "12%",
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        title="System Mamul"
        onOk={onSubmit}
        width={"90%"}
        onCancel={onHide}
        footer={[]}
      >
        <Table
          columns={SystemMamul}
          dataSource={Mamul}
          scroll={{ x: 1000, y: 200 }}
          size="small"
          pagination={false}
          tableLayout="fixed"
        />
      </Modal>
    </>
  );
};

export default SystemMamul;
