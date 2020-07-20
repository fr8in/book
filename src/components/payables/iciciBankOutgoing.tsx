import React from "react";
import { Table, Input, Row, Col, Button, Tooltip } from "antd";
import Payables from "../../../mock/payables/payables";
import { CheckCircleTwoTone } from "@ant-design/icons";

export default function OutGoing() {
  const OutGoing = [
    {
      title: "Outgoing No",
      dataIndex: "outgoingNo",
      key: "outgoingNo",
      sorter: true,
      width: "7%",
    },
    {
      title: "DocDate",
      dataIndex: "docDate",
      key: "docDate",
      sorter: true,
      width: "5%",
    },
    {
      title: "Vendor Code",
      dataIndex: "vendorCode",
      key: "vendorCode",
      width: "6%",
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor",
      key: "vendor",
      sorter: true,
      width: "7%",
    },
    {
      title: "Bank Amt",
      dataIndex: "bankAmt",
      key: "bankAmt",
      width: "5%",
    },
    {
      title: "Tran Type",
      dataIndex: "tranType",
      key: "tranType",
      width: "5%",
    },
    {
      title: "Acct Name",
      dataIndex: "accountName",
      key: "accountName",
      width: "6%",
    },

    {
      title: "Bank Acct",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: "8%",
    },
    {
      title: "IFSC Code",
      dataIndex: "ifscCode",
      key: "ifscCode",
      width: "6%",
    },
    {
      title: "Payable Stat",
      dataIndex: "payableStat",
      key: "payableStat",
      width: "6%",
    },
    {
      title: "Ref Number",
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      width: "7%",
      render: () => (
        <Col flex="100px">
          <Row className="m5">
            <Input size="small" />
            <CheckCircleTwoTone />
          </Row>
        </Col>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "6%",
      render: () => <Button size="small">Execute Transfer</Button>,
    },
  ];

  return (
    <Table
      columns={OutGoing}
      dataSource={Payables}
      size="small"
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  );
}
