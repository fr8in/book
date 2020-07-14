import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function addUser() {
  const addUser = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "User Branch",
      dataIndex: "userBranch",
    },
    {
      title: "Operating City",
      dataIndex: "operatingCity",
    },
  ];

  return (
    <PageLayout title="addUser">
      <Table
        columns={addUser}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
