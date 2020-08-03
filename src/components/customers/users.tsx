import { Table, Button, Switch } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
//import userData from '../../../mock/customer/users'

const Users = (props) => {
  const { customerUser, loading } = props;
  console.log("customerUser", customerUser);

  const addUser = [
    {
      title: "Name",
      dataIndex: "name",
      width: "15%",
    },

    {
      title: "Mobile No",
      dataIndex: "mobile",
      width: "20%",
    },

    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
    },
    {
      title: "User Branch",
      dataIndex: "branch_name",
      width: "20%",
    },
    {
      title: "Operating City",
      dataIndex: "operatingCity",
      width: "10%",
    },
    {
      title: "Master",
      render: (text, record) => <Switch defaultChecked />,
      width: "10%",
    },
    {
      title: "Action",
      render: (text, record) => (
        <span className="actions">
          <Button type="link" icon={<DeleteOutlined />} />
          <Button type="link" icon={<EditOutlined />} />
        </span>
      ),
      width: "12%",
    },
  ];

  return (
    <Table
      columns={addUser}
      dataSource={customerUser}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      loading={loading}
    />
  );
};

export default Users;
