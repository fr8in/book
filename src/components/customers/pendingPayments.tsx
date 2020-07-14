import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function pendingPayments() {
  const pendingPayments = [
    {
      title: "Pending Payments",
      dataIndex: "pendingPayments",
    },
    {
      title: "Advance",
      dataIndex: "advance",
    },
    {
      title: "Invoice Pending",
      dataIndex: "invoicePending",
    },
    {
      title: "Invoiced",
      dataIndex: "invoiced",
    },
  ];

  return (
    <PageLayout title="pendingPayments">
      <Table
        columns={pendingPayments}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
