import React from "react";
import { Table, Button } from "antd";
import Branch from "../../../mock/branches/branches";
import { EditTwoTone } from "@ant-design/icons";

import AddTraffic from "../branches/addTraffic";
import useShowHideWithRecord from "../../hooks/useShowHideWithRecord";

const Branches = () => {
  const initial = {
    trafficVisible: false,
    title: null,
    trafficData: [],
  };
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial);

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
            <EditTwoTone
              className="link"
              onClick={() =>
                handleShow("trafficVisible", record.branchName, null, null)
              }
            />
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
      {object.trafficVisible && (
        <AddTraffic
          visible={object.trafficVisible}
          onHide={handleHide}
          data={object.trafficData}
          title={object.title}
        />
      )}
    </>
  );
};

export default Branches;
