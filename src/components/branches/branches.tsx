import React from "react";
import { Table } from "antd";
import Branch from "../../../mock/branches/branches";

export default function Branches() {
  const Branches = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      keys: "branchName",
    },
    {
      title: "Connected City",
      dataIndex: "connectedCity",
      keys: "connectedCity",
    },
    {
      title: "Traffic Members",
      dataIndex: "trafficMembers",
      keys: "trafficMembers",
    },
    {
      title: "Weekly Target",
      dataIndex: "weeklyTarget",
      keys: "weeklyTarget",
    },
  ];

  return (
    <Table
      columns={Branches}
      dataSource={Branch}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
