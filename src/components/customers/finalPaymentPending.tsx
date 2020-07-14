import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function finalPaymentsPending() {
  const finalPaymentsPending = [
    {
      title: "LoadId",
      dataIndex: "loadId",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
    },
    {
      title: "Truk No",
      dataIndex: "trukNo",
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
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "Aging",
      dataIndex: "balance",
    },
  ];

  return (
    <PageLayout title="finalPaymentsPending">
      <Table
        columns={finalPaymentsPending}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
