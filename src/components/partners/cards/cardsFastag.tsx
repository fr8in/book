import React from "react";
import { Table } from "antd";
import PageLayout from "../../layout/pageLayout";
import Cards from "../../../../mock/card/cards";

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
    },
    {
      title: "Reverse",
      dataIndex: "Reverse",
    },
    {
      title: "d",
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
