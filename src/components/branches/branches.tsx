import React from "react";
import { Table, Button } from "antd";
import Branch from "../../../mock/branches/branches";
import { EditTwoTone } from "@ant-design/icons";
import useShowHide from "../../hooks/useShowHide";
import AddTraffic from "../branches/addTraffic";

const Branches = () => {
  const initial = { traffic: false };
  const { visible, onShow, onHide } = useShowHide(initial);

  const Branches = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      width: "13%",
    },
    {
      title: "Connected City",
      dataIndex: "connectedCity",
      key: "connectedCity",
      width: "25%",
    },
    {
      title: "Traffic Members",
      dataIndex: "trafficMembers",
      key: "trafficMembers",
      width: "25%",
      render: (text, record) => {
        return (
          <span className="pull-left">
            <a>{text} </a>
            <EditTwoTone onClick={() => onShow("traffic")} />
          </span>
        );
      },
    },
    {
      title: "Weekly Target",
      dataIndex: "weeklyTarget",
      key: "weeklyTarget",
      width: "25%",
      render: (text, record) => {
        return (
          <span className="pull-left">
            <a>{text} </a>
            <EditTwoTone />
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={Branches}
        dataSource={Branch}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
      {visible.traffic && (
        <AddTraffic
          visible={visible.traffic}
          onHide={() => onHide("traffic")}
        />
      )}
    </>
  );
};

export default Branches;
