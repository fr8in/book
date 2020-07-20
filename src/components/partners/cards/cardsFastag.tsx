import React from "react";
import { Table, Button, Switch } from "antd";
import {
  DownloadOutlined,
  LeftCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

import Cards from "../../../../mock/card/cards";

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

export default function CardsFastag() {
  const CardsFastag = [
    {
      title: "Tag Id",
      dataIndex: "tagId",
      key: "tagId",
      width: "17%",
    },
    {
      title: "Truck No",
      dataIndex: "truckNo",
      key: "truckNo",
      width: "9%",
    },
    {
      title: "ST Code",
      dataIndex: "stCode",
      key: "stCode",
      width: "8%",
    },
    {
      title: "Partner",
      dataIndex: "partner",
      key: "partner",
      width: "11%",
    },
    {
      title: "Partner State",
      dataIndex: "partnerStates",
      key: "partnerStates",
      width: "10%",
    },
    {
      title: "Tag Bal",
      dataIndex: "tagBal",
      key: "tagBal",
      sorter: true,
      width: "8%",
    },
    {
      title: "T.Status",
      dataIndex: "tStatus",
      key: "tStatus",
      width: "6%",
    },

    {
      title: "C.Status",
      dataIndex: "cStatus",
      key: "cStatus",
      width: "6%",
      render: () => <Switch size="small" defaultChecked onChange={onChange} />,
    },
    {
      title: "Reverse",
      dataIndex: "Reverse",
      key: "cardId",
      width: "7%",
      render: () => <LeftCircleOutlined />,
    },
    {
      title: (
        <Button size="small">
          Sus.
          <DownloadOutlined />
        </Button>
      ),
      width: "7%",
      render: () => <StopOutlined />,
    },
  ];

  return (
    <Table
      columns={CardsFastag}
      dataSource={Cards}
      size="small"
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  );
}
