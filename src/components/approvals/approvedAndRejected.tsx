import React from "react";
import { Table } from "antd";

import pendingDetail from "../../../mock/approval/approvalPending";

const creditType = [
  { value: 1, text: "Credit Note" },
  { value: 2, text: "Debit Note" },
  { value: 3, text: "Dispute" },
];
const issueTypeList = [
  { value: 1, text: "Loading Charges" },
  { value: 2, text: "Unloading Charges" },
  { value: 3, text: "Loading Halting" },
  { value: 4, text: "Unloading Halting" },
  { value: 5, text: "Commission Fee" },
  { value: 6, text: "POD Late Fee" },
  { value: 7, text: "POD Missing" },
  { value: 8, text: "Price Difference" },
  { value: 9, text: "On-Hold" },
];
const requestedBy = [
  { value: 1, text: "Partner" },
  { value: 2, text: "Fr8" },
];

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

export default function approvedAndRejected() {
  const ApprovalPending = [
    {
      title: "Load ID",
      dataIndex: "loadId",
    },
    {
      title: "Type",
      dataIndex: "type",
      filters: creditType,
    },
    {
      title: "Issue Type",
      dataIndex: "issueType",
      filters: issueTypeList,
    },
    {
      title: "Claim ₹",
      dataIndex: "claim",
    },
    {
      title: "Approved ₹",
      dataIndex: "approved",
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Request By",
      dataIndex: "requestBy",
      filters: requestedBy,
    },

    {
      title: "Req.On",
      dataIndex: "reqOn",
      sorter: true,
    },
    {
      title: "Closed By",
      dataIndex: "closedBy",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
  ];

  return (
    <Table
      columns={ApprovalPending}
      dataSource={pendingDetail}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
