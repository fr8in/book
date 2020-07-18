import React from "react";
import { Table } from "antd";

export default function OutGoing() {
  const OutGoing = [
    {
      title: "Outgoing No",
      dataIndex: "outgoingNo",
      key: "outgoingNo",
      sorter: true,
    },
    {
      title: "DocDate",
      dataIndex: "docDate",
      key: "docDate",
      sorter: true,
    },
    {
      title: "Vendor Code",
      dataIndex: "vendorCode",
      key: "vendorCode",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      sorter: true,
    },
    {
      title: "Bank Amt",
      dataIndex: "bankAmt",
      key: "bankAmt",
    },
    {
      title: "Tran Type",
      dataIndex: "tranType",
      key: "tranType",
    },
    {
      title: "Acc Name",
      dataIndex: "accName",
      key: "accName",
    },

    {
      title: "Bank Acc",
      dataIndex: "bankAcc",
      key: "bankAcc",
    },
    {
      title: "IFSC Code",
      dataIndex: "ifscCode",
      key: "ifscCode",
    },
    {
      title: "Payable Stat",
      dataIndex: "payableStat",
      key: "payableStat",
    },
    {
      title: "Reference Number",
      dataIndex: "referenceNumber",
      key: "referenceNumber",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <Table
      columns={OutGoing}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
