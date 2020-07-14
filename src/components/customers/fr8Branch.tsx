import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function fr8Branch() {
  const fr8Branch = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
    },
    {
      title: "Orders",
      dataIndex: "orders",
    },
    {
      title: "Traffic",
      dataIndex: "traffic",
    },
  ];

  return (
    <PageLayout title="Customer">
      <Table
        columns={fr8Branch}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
