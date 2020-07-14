import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function invoicePending() {
  const invoicePending = [
    {
      title: "Load Id",
      dataIndex: "loadId",
    },
    {
      title: "Source",
      dataIndex: "source",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Destination",
      dataIndex: "destination",
    },
    {
      title: "Truck No",
      dataIndex: "truckNo",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "SO Price",
      dataIndex: "soPrice",
    },
    {
      title: "Received",
      dataIndex: "received",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
  ];

  return (
    <PageLayout title="invoicePending">
      <Table
        columns={invoicePending}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
