import React from "react";
import { Table, Input, Tooltip, Button } from "antd";
import {
  SearchOutlined,
  CommentOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

import useShowHide from "../../hooks/useShowHide";
import pendingDetail from "../../../mock/approval/approvalPending";

const RegionList = [
  { value: 1, text: "North" },
  { value: 11, text: "South-1" },
  { value: 12, text: "East-1" },
  { value: 13, text: "West-1" },
  { value: 20, text: "South-2" },
  { value: 21, text: "East-2" },
  { value: 22, text: "West-2" },
];
const RequestedBy = [
  { value: 1, text: "Partner" },
  { value: 11, text: "Fr8" },
];

export default function Pending() {
  const initial = { tripIdSearch: false };
  const { visible, onShow } = useShowHide(initial);
  const ApprovalPending = [
    {
      title: "Load ID",
      dataIndex: "loadId",
      key: "loadId",
      width: "6%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "8%",
    },
    {
      title: "Issue Type",
      dataIndex: "issueType",
      key: "issueType",
      width: "10%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "6%",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: "11%",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      filters: RegionList,
      width: "7%",
    },
    {
      title: "Request By",
      dataIndex: "requestBy",
      key: "requestBy",
      filters: RequestedBy,
      width: "13%",
    },

    {
      title: "Req.On",
      dataIndex: "reqOn",
      key: "reqOn",
      sorter: true,
      width: "7%",
    },
    {
      title: "Responsibility",
      dataIndex: "responsibility",
      key: "responsibility",
      width: "11%",
      filterDropdown: (
        <div>
          <Input placeholder="Search" id="id" name="id" type="number" />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilterDropdownVisibleChange: () => onShow("Search"),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "9%",
      render: (text, record) => {
        return record.comment && record.comment.length > 9 ? (
          <Tooltip title={record.comment}>
            {record.comment.slice(0, 9) + "..."}
          </Tooltip>
        ) : (
          record.comment
        );
      },
    },
    {
      title: "Action",
      width: "12%",
      render: (text, record) => (
        <span className="actions">
          <Tooltip title="Comment">
            <Button type="link" icon={<CommentOutlined />} />
          </Tooltip>
          <Tooltip title="Accept">
            <Button type="link" icon={<CheckCircleTwoTone />} />
          </Tooltip>
          <span>
            <Tooltip title="Decline">
              <Button type="link" icon={<CloseCircleTwoTone />} />
            </Tooltip>
          </span>
        </span>
      ),
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
