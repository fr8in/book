import React from "react";
import { Table, Button, Switch } from "antd";
import {
  DownloadOutlined,
  LeftCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import PageLayout from "../../layout/pageLayout";
import Cards from "../../../../mock/card/cards";

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

export default function cardsFastag() {
  const cardsFastag = [
    {
      title: "Tag Id",
      dataIndex: "tagId",
    },
    {
      title: "Truck No",
      dataIndex: "truckNo",
    },
    {
      title: "ST Code",
      dataIndex: "stCode",
    },
    {
      title: "Partner",
      dataIndex: "partner",
    },
    {
      title: "Partner State",
      dataIndex: "partnerStates",
    },
    {
      title: "Tag Bal",
      dataIndex: "tagBal",
      sorter: true,
    },
    {
      title: "T.Status",
      dataIndex: "tStatus",
    },

    {
      title: "C.Status",
      dataIndex: "cStatus",
      render: () => <Switch size="small" defaultChecked onChange={onChange} />,
    },
    {
      title: "Reverse",
      dataIndex: "Reverse",
      render: () => <LeftCircleOutlined />,
    },
    {
      title: (
        <Button size="small">
          Sus.
          <DownloadOutlined />
        </Button>
      ),
      render: () => <StopOutlined />,
    },
  ];

  return (
    <PageLayout title="cardsFuel">
      <Table
        columns={cardsFastag}
        dataSource={Cards}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
