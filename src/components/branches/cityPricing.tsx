import React from "react";
import { Table } from "antd";
import Branch from "../../../mock/branches/branches";

const CityPricing = () => {
  const CityPricing = [
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: "10%",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      width: "10%",
    },
    {
      title: "Customer Add Rate",
      dataIndex: "customerAddRate",
      key: "customerAddRate",
      width: "10%",
    },
    {
      title: "Customer Add Per Km",
      dataIndex: "customerAddPerKm",
      key: "customerAddPerKm",
      width: "12%",
    },
    {
      title: "Partner Add Rate",
      dataIndex: "partnerAddRate",
      key: "partnerAddRate",
      width: "10%",
    },
    {
      title: "Partner Add per Km",
      dataIndex: "partnerPerKm",
      key: "partnerPerKm",
      width: "10%",
    },
    {
      title: "Source Dry Run %",
      dataIndex: "sourceDryRun",
      key: "sourceDryRun",
      width: "10%",
    },
    {
      title: "Destination Dry Run %",
      dataIndex: "destinationDryRun",
      key: "destinationDryRun",
      width: "15%",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      width: "12%",
    },
  ];

  return (
    <Table
      columns={CityPricing}
      dataSource={Branch}
      size="small"
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  );
};

export default CityPricing;
