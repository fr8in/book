import React from "react";
import { Table } from "antd";
import Branch from "../../../mock/branches/branches";

export default function Branches() {
  const Branches = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      width: "13%",
    },
    {
      title: "Connected City",
      dataIndex: "connectedCity",
      key: "connectedCity",
      width: "25%",
    },
    {
      title: "Traffic Members",
      dataIndex: "trafficMembers",
      key: "trafficMembers",
      width: "25%",
    },
    {
      title: "Weekly Target",
      dataIndex: "weeklyTarget",
      key: "weeklyTarget",
      width: "25%",
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
