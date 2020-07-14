import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function customerBranch() {
  const customerBranch = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "State",
      dataIndex: "state",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  return (
    <PageLayout title="customerBranch">
      <Table
        columns={customerBranch}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
