import React from "react";
import { Table } from "antd";
import Payables from "../../../mock/payables/payables";

const DownPayment = () => {
  const DownPayment = [
    {
      title: "Load ID",
      dataIndex: "loadId",
      key: "loadId",
      width: "4%",
      sorter: true,
    },
    {
      title: "Vendor Code",
      dataIndex: "vendorCode",
      key: "vendorCode",
      width: "5%",
      sorter: true,
    },
    {
      title: "Advance Percentage",
      dataIndex: "advancePercentage",
      key: "advancePercentage",
      sorter: true,
      width: "6%",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      sorter: true,
      width: "6%",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      sorter: true,
      width: "8%",
    },
    {
      title: "IFSC Code",
      dataIndex: "ifscCode",
      key: "ifscCode",
      sorter: true,
      width: "5%",
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      sorter: true,
      width: "5%",
    },

    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      sorter: true,
      width: "5%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: true,
      width: "5%",
    },
  ];

  return (
    <Table
      columns={DownPayment}
      dataSource={Payables}
      size="small"
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  );
};

export default DownPayment;
