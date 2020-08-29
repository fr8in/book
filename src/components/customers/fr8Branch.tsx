import { Table } from "antd";
import branchData from "../../../mock/customer/branch";

const Fr8Branch = (props) => {
const {employee} =props
  const fr8Branch = [
    {
      title: "Branch Name",
      dataIndex: "name",
      width: "50%",
      render: (text, record) => {
      return (record.name)
      }
    },
    {
      title: "Traffic",
      dataIndex: "traffic",
      width: "50%",
    },
  ];

  return (
    <Table
      columns={fr8Branch}
      dataSource={employee}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      //loading={loading}
    />
  );
};

export default Fr8Branch;
