import React from "react";
import { Table } from "antd";
import Branch from "../../../mock/branches/branches";

export default function CityPricing() {
  const CityPricing = [
    {
      title: "City",
      dataIndex: "city",
      keys: "city",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      keys: "branch",
    },
    {
      title: "Customer Add Rate",
      dataIndex: "customerAddRate",
      keys: "customerAddRate",
    },
    {
      title: "Customer Add Per Km",
      dataIndex: "customerAddPerKm",
      keys: "customerAddPerKm",
    },
    {
      title: "Partner Add Rate",
      dataIndex: "partnerAddRate",
      keys: "partnerAddRate",
    },
    {
      title: "Partner Add per Km",
      dataIndex: "partnerPerKm",
      keys: "partnerPerKm",
    },
    {
      title: "Source Dry Run %",
      dataIndex: "sourceDryRun",
      keys: "sourceDryRun",
    },
    {
      title: "Destination Dry Run %",
      dataIndex: "destinationDryRun",
      keys: "destinationDryRun",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      keys: "operation",
    },
  ];

  return (
    <Table
      columns={CityPricing}
      dataSource={Branch}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
