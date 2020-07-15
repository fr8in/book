import React from "react";
import { Table, Checkbox, Input } from "antd";
import { FilterOutlined, DownSquareOutlined } from "@ant-design/icons";
import PageLayout from "../layout/pageLayout";
import pendingDetail from "../../../mock/approval/approvalPending";
const { Search } = Input;

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

export default function pending() {
  const ApprovalPending = [
    {
      title: "Load ID",
      dataIndex: "loadId",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Issue Type",
      dataIndex: "issueType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Region",
      dataIndex: "region",
      filterDropdown: (
        <div className="filterMenu">
          <Checkbox onChange={onChange}>North</Checkbox>
          <Checkbox onChange={onChange}>South-1</Checkbox>
          <Checkbox onChange={onChange}>East-1</Checkbox>
          <Checkbox onChange={onChange}>West-1</Checkbox>
          <Checkbox onChange={onChange}>South-2</Checkbox>
          <Checkbox onChange={onChange}>East-2</Checkbox>
          <Checkbox onChange={onChange}>West-2</Checkbox>
        </div>
      ),
      filterIcon: <FilterOutlined />,
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
      title: "Responsibility",
      dataIndex: "responsibility",
      filterDropdown: (
        <Search
          placeholder="Search..."
          onSearch={(value) => console.log(value)}
        />
      ),
      filterIcon: <DownSquareOutlined />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },
    {
      title: "Action",
      dataIndex: "action",
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
