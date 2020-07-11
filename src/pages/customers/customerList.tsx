import React, { Component } from "react";
import { Table } from "antd";
import cusMock from "../../../mock/CustomerListMock";

export default class CustomerList extends Component {
  render() {
    const columnsCurrent = [
      {
        title: "Customer",
        dataIndex: "name",
        key: "name",
        className: "pl20",
      },
      {
        title: "User Phone",
        dataIndex: "mobileNoList",
        key: "mobileNoList",
      },
      {
        title: "Orders",
        dataIndex: "noOfLoadsTaken",
        key: "noOfLoadsTaken",

        sorter: true,
      },
      {
        title: "systemMamul",
        dataIndex: "systemMamul",
        key: "systemMamul",
      },
      {
        title: "Credit Limit",
        dataIndex: "creditLimit",
        key: "creditLimit",
      },
      {
        title: "Receivables",
        dataIndex: "receivables",
        key: "receivables",
      },
      {
        title: "Receivable Days",
        dataIndex: "workingCapitalDays",
        key: "workingCapitalDays",
      },
      {
        title: "Status",
        dataIndex: "Status",

        key: "Status",
      },
    ];

    return <Table columns={columnsCurrent} dataSource={cusMock} />;
  }
}
