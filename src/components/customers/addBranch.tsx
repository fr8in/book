import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function addBranch() {
  const addBranch = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Building Number",
      dataIndex: "buildingNumber",
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
      title: "Pin",
      dataIndex: "pin",
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
    },
  ];

  return (
    <PageLayout title="addBranch">
      <Table
        columns={addBranch}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
