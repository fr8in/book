import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function customerUsers() {
  const customerUsers = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Loads From",
      dataIndex: "loadsFrom",
    },
    {
      title: "Branch",
      dataIndex: "branch",
    },
    {
      title: "Master",
      dataIndex: "master",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  return (
    <PageLayout title="customerUsers">
      <Table
        columns={customerUsers}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
