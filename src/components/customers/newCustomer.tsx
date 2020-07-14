import React, { Component } from "react";
import { Table } from "antd";
import newCusMock from "../../../mock/customer/newCusMock";
import PageLayout from "../layout/pageLayout";

export default function NewCustomer() {
  const newCustomer = [
    {
      title: "User Name",
      dataIndex: "name",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
    },
    {
      title: "Customer Type",
      dataIndex: "companyType",
    },
    {
      title: "Reg Date",
      dataIndex: "registrationDate",
    },
    {
      title: "PAN",
      dataIndex: "panNo",
    },
    {
      title: "Credit Limit",
      dataIndex: "type",
    },
    {
      title: "Default Mamul",
      dataIndex: "mamul",
    },
    {
      title: "Advance %",
      dataIndex: "advancePercentage",
    },
    {
      title: "Action",
    },
  ];

  return (
    <PageLayout title="Customer">
      <Table
        columns={newCustomer}
        dataSource={newCusMock}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
