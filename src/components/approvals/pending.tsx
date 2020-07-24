import { Table, Input, Tooltip, Button, Space } from "antd";
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import useShowHideWithRecord from "../../hooks/useShowHideWithRecord";
import pendingDetail from "../../../mock/approval/approvalPending";
import Comment from "../../components/trips/tripFeedBack";
import Approve from "../approvals/accept";

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
  const initial = {
    commentData: [],
    commentVisible: false,
    approveVisible: false,
    title: null,
    approveData: [],
  };
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial);

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
      sorter: (a, b) => (a.reqOn > b.reqOn ? 1 : -1),
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
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "9%",
      render: (text, record) => {
        return record.comment && record.comment.length > 9 ? (
          <Tooltip title={record.comment}>
            <span> {record.comment.slice(0, 9) + "..."}</span>
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
        <Space>
          <Tooltip title="Comment">
            <Button
              type="link"
              icon={<CommentOutlined />}
              onClick={() =>
                handleShow(
                  "commentVisible",
                  null,
                  "commentData",
                  record.previousComment
                )
              }
            />
          </Tooltip>
          <Tooltip title="Accept">
            <Button
              type="primary"
              shape="circle"
              size="small"
              className="btn-success"
              icon={<CheckOutlined />}
              onClick={() =>
                handleShow("approveVisible", "Approved", "approveData", record)
              }
            />
          </Tooltip>
          <Tooltip title="Decline">
            <Button
              type="primary"
              shape="circle"
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() =>
                handleShow("approveVisible", "Rejected", "approveData", record)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={ApprovalPending}
        dataSource={pendingDetail}
        size="small"
        scroll={{ x: 1156, y: 400 }}
        pagination={false}
        className="withAction"
      />
      {object.commentVisible && (
        <Comment
          visible={object.commentVisible}
          data={object.commentData}
          onHide={handleHide}
        />
      )}
      {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          data={object.approveData}
          title={object.title}
        />
      )}
    </>
  );
}
