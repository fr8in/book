import { Table, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
//import branchData from '../../../mock/customer/branch'

const Branch = (props) => {
  const { customerBranch, loading } = props;
  console.log("customerBranch", customerBranch);
  const column = [
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      width: "15%",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "10%",
    },

    {
      title: "Address",
      dataIndex: "address",
      width: "15%",
    },
    {
      title: "City",
      dataIndex: "city",
      width: "10%",
      render: (text, record) => record.city && record.city.name,
    },
    {
      title: "State",
      dataIndex: "state_id",
      width: "10%",
      render: (text, record) => {
        return record.state && record.state.name;
      },
    },
    {
      title: "Pin",
      dataIndex: "pincode",
      width: "10%",
    },
    {
      title: "Contact No",
      dataIndex: "mobile",
      width: "10%",
    },
    {
      title: "Action",
      render: (text, record) => (
        <span>
          <Button type="link" icon={<DeleteOutlined />} />
          <Button type="link" icon={<EditOutlined />} />
        </span>
      ),
      width: "10%",
    },
  ];

  return (
    <Table
      columns={column}
      dataSource={customerBranch}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      className="withAction"
      loading={loading}
    />
  );
};

export default Branch;
