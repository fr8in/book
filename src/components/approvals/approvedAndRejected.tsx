import React from "react";
import { Table, Checkbox, Input } from "antd";
import { FilterOutlined, DownSquareOutlined } from "@ant-design/icons";
import PageLayout from "../layout/pageLayout";
import pendingDetail from "../../../mock/approval/approvalPending";
const { Search } = Input;

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
      filterDropdown: (
        <div className="filterMenu">
          <Checkbox onChange={onChange}>Credit Note</Checkbox>
          <Checkbox onChange={onChange}>Debit Note</Checkbox>
          <Checkbox onChange={onChange}>Dispute</Checkbox>
        </div>
      ),
      filterIcon: <FilterOutlined />,
    },
    {
      title: "Issue Type",
      dataIndex: "issueType",
      filterDropdown: (
        <div className="filterMenu">
          <Checkbox onChange={onChange}>Loading Charges</Checkbox>
          <Checkbox onChange={onChange}>Unloading Charges</Checkbox>
          <Checkbox onChange={onChange}>Loading Halting</Checkbox>
          <Checkbox onChange={onChange}>Unloading Halting</Checkbox>
          <Checkbox onChange={onChange}>Commission Fee</Checkbox>
          <Checkbox onChange={onChange}>Late Delivery Fee</Checkbox>
          <Checkbox onChange={onChange}>POD Late Fee</Checkbox>
          <Checkbox onChange={onChange}>POD Missing</Checkbox>
          <Checkbox onChange={onChange}>Price Difference</Checkbox>
          <Checkbox onChange={onChange}>On-Hold</Checkbox>
        </div>
      ),
      filterIcon: <FilterOutlined />,
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
      filterDropdown: (
        <div className="filterMenu">
          <Checkbox onChange={onChange}>Partner</Checkbox>
          <Checkbox onChange={onChange}>Fr8</Checkbox>
        </div>
      ),
      filterIcon: <FilterOutlined />,
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
    <PageLayout title="pending">
      <Table
        columns={ApprovalPending}
        dataSource={pendingDetail}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
