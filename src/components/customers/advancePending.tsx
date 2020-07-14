import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function advancePending() {
  const advancePending = [
    {
      title: "Load Id",
      dataIndex: "loadId",
    },
    {
      title: "Order",
      dataIndex: "order",
    },
    {
      title: "Truck No",
      dataIndex: "truckNo",
    },
    {
      title: "Source",
      dataIndex: "source",
    },
    {
      title: "Destination",
      dataIndex: "destination",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },
    {
      title: "Customer Price",
      dataIndex: "customerPrice",
    },
    {
      title: "Received",
      dataIndex: "received",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "Aging",
      dataIndex: "aging",
    },
  ];

  return (
    <PageLayout title="advancePending">
      <Table
        columns={advancePending}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
