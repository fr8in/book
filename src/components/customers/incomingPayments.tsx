import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function incomingPayments() {
  const incomingPayments = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Booked",
      dataIndex: "booked",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
  ];

  return (
    <PageLayout title="incomingPayments">
      <Table
        columns={incomingPayments}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
