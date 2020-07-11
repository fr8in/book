import React, { Component } from "react";
import { Table } from "antd";
import newCusMock from "../../../mock/newCusMock";

export default class NewCustomer extends Component {
  render() {
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

    return <Table columns={newCustomer} dataSource={newCusMock} />;
  }
}
