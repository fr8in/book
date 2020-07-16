import React from "react";
import { Table, Input } from "antd";
import { DownSquareOutlined } from "@ant-design/icons";
import PageLayout from "../../layout/pageLayout";
import cards from "../../../../mock/card/cards";
const { Search } = Input;

export default function cardsFuel() {
  const cardsFuel = [
    {
      title: "Card ID",
      dataIndex: "cardId",
    },
    {
      title: "Card Provider",
      dataIndex: "cardProvider",
      filterDropdown: (
        <div className="filterMenu">
          <Search
            placeholder="Search Card Provider"
            onSearch={(value) => console.log(value)}
            enterButton
          />
        </div>
      ),
      filterIcon: <DownSquareOutlined />,
    },
    {
      title: "Card Number",
      dataIndex: "cardNumber",
      filterDropdown: (
        <div className="filterMenu">
          <Search
            placeholder="Search Card Number"
            onSearch={(value) => console.log(value)}
            enterButton
          />
        </div>
      ),
      filterIcon: <DownSquareOutlined />,
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "Partner Name",
      dataIndex: "partnerName",
      filterDropdown: (
        <div className="filterMenu">
          <Search
            placeholder="Search Partner Name"
            onSearch={(value) => console.log(value)}
            enterButton
          />
        </div>
      ),
      filterIcon: <DownSquareOutlined />,
    },
    {
      title: "Partner State",
      dataIndex: "partnerState",
    },
    {
      title: "Truck",
      dataIndex: "truck",
      filterDropdown: (
        <div className="filterMenu">
          <Search
            placeholder="Search Device Number"
            onSearch={(value) => console.log(value)}
            enterButton
          />
        </div>
      ),
      filterIcon: <DownSquareOutlined />,
    },

    {
      title: "Partner Number",
      dataIndex: "partnerNumber",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Edit",
      dataIndex: "Edit",
    },
  ];

  return (
    <PageLayout title="cardsFuel">
      <Table
        columns={cardsFuel}
        dataSource={cards}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
