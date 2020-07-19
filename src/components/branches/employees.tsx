import React from "react";
import { Table } from "antd";
import Branch from "../../../mock/branches/branches";

export default function Employees() {
  const Employees = [
    {
      title: "Name",
      dataIndex: "name",
      keys: "name",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      keys: "mobileNumber",
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
