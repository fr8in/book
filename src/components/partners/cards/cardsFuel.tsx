import React from "react";
import { Table, Input, Switch } from "antd";
import { DownSquareOutlined } from "@ant-design/icons";

import cards from "../../../../mock/card/cards";
import Link from "next/link";
const { Search } = Input;

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};

const CardsFuel = () => {
  const CardsFuel = [
    {
      title: "Card ID",
      dataIndex: "cardId",
      key: "cardId",
      width: "8%",
    },
    {
      title: "Card Provider",
      dataIndex: "cardProvider",
      key: "cardProvider",
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
      width: "12%",
    },
    {
      title: "Card Number",
      dataIndex: "cardNumber",
      key: "cardNumber",
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
      width: "13%",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: "8%",
    },
    {
      title: "Partner Name",
      dataIndex: "partnerName",
      key: "partnerName",
      render: (text, record) => {
        return (
          <Link href="partners/[id]" as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        );
      },
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
      width: "14%",
    },
    {
      title: "Partner State",
      dataIndex: "partnerState",
      key: "partnerState",
    },
    {
      title: "Truck",
      dataIndex: "truck",
      key: "truck",
      render: (text, record) => {
        return (
          <Link href="trucks/[id]" as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        );
      },
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
      width: "12%",
    },

    {
      title: "Partner Number",
      dataIndex: "partnerNumber",
      key: "partnerNumber",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "8%",
      render: (text, record) => (
        <Switch size="small" defaultChecked onChange={onChange} />
      ),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      width: "4%",
    },
  ];

  return (
    <Table
      columns={CardsFuel}
      dataSource={cards}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 1156, y: 400 }}
      pagination={false}
    />
  );
};

export default CardsFuel;
