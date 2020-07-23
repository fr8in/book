import React from "react";
import { Table, Button, Switch } from "antd";
import Link from "next/link";
import FastagSuspend from "../cards/fastagSuspend";
import FastagReversal from "./fastagReversal";
import useShowHide from "../../../hooks/useShowHide";
import {
  DownloadOutlined,
  LeftCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

import Cards from "../../../../mock/card/cards";

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};

const CardsFastag = () => {
  const initial = { suspend: false, reversal: false };
  const { visible, onShow, onHide } = useShowHide(initial);

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
      render: (text, record) => {
        return (
          <Link href="trucks/[id]" as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        );
      },
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
      render: (text, record) => {
        return (
          <Link href="partners/[id]" as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        );
      },
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
      render: () => (
        <Button
          size="small"
          shape="circle"
          icon={<LeftCircleOutlined />}
          onClick={() => onShow("reversal")}
        />
      ),
    },
    {
      title: (
        <Button size="small">
          Sus.
          <DownloadOutlined />
        </Button>
      ),
      width: "7%",
      render: () => (
        <Button
          size="small"
          shape="circle"
          icon={<StopOutlined />}
          onClick={() => onShow("suspend")}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={CardsFastag}
        dataSource={Cards}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 1156, y: 400 }}
        pagination={false}
      />

      {visible.suspend && (
        <FastagSuspend
          visible={visible.suspend}
          onHide={() => onHide("suspend")}
        />
      )}
      {visible.reversal && (
        <FastagReversal
          visible={visible.reversal}
          onHide={() => onHide("reversal")}
        />
      )}
    </>
  );
};

export default CardsFastag;
