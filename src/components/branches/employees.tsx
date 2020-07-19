import React from "react";
import { Table } from "antd";
import Branch from "../../../mock/branches/branches";

export default function Employees() {
  const Employees = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: "20%",
    },
  ];

  return (
    <Table
      columns={Employees}
      dataSource={Branch}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
