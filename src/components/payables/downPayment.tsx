import React from "react";
import { Table } from "antd";

export default function DownPayment() {
  const DownPayment = [
    {
      title: "Load ID",
      dataIndex: "loadId",
      key: "loadId",
      sorter: true,
    },
    {
      title: "Vendor Code",
      dataIndex: "vendorCode",
      key: "vendorCode",
      sorter: true,
    },
    {
      title: "Advance Percentage",
      dataIndex: "advancePercentage",
      key: "advancePercentage",
      sorter: true,
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      sorter: true,
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      sorter: true,
    },
    {
      title: "IFSC Code",
      dataIndex: "ifscCode",
      key: "ifscCode",
      sorter: true,
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      sorter: true,
    },

    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      sorter: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: true,
    },
  ];

  return (
    <Table
      columns={DownPayment}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
