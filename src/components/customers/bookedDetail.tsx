import React from "react";
import { Table } from "antd";

import PageLayout from "../layout/pageLayout";

export default function bookedDetail() {
  const bookedDetail = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Load Id",
      dataIndex: "loadId",
    },
    {
      title: "Invoice No",
      dataIndex: "truckNo",
    },
    {
      title: "Booked For",
      dataIndex: "bookedFor",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  return (
    <PageLayout title="bookedDetail">
      <Table
        columns={bookedDetail}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
