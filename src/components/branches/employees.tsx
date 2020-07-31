import React from "react";
import { Table } from "antd";
//import Branch from '../../../mock/branches/branches'

const Employees = (props) => {
  const { employees, loading } = props;

  const Employees = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: "20%",
    },
  ];

  return (
    <Table
      columns={Employees}
      dataSource={employees}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
      loading={loading}
    />
  );
};

export default Employees;
