import { Table, Button, Switch } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
//import userData from '../../../mock/customer/users'

const Users = (props) => {
  const { customeruser, loading } = props;
  console.log("customerUser", customeruser);

  
  const addUser = [
    {
      title: "Name",
      render: (text,record) => {
        const name = customeruser && customeruser.customer_users &&customeruser.customer_users.length > 0 && customeruser.customer_users[0].name ? customeruser.customer_users[0].name : 'null'
        return (name)
      },
      width: "15%",
    },

    {
      title: "Mobile No",
      render: (text,record) => {
        const mobile = customeruser && customeruser.customer_users &&customeruser.customer_users.length > 0 && customeruser.customer_users[0].mobile ? customeruser.customer_users[0].mobile : 'null'
        return (mobile)
      },
      width: "20%",
    },

    {
      title: "Email",
      render: (text,record) => {
        const email = customeruser && customeruser.customer_users &&customeruser.customer_users.length > 0 && customeruser.customer_users[0].email ? customeruser.customer_users[0].email : 'null'
        return (email)
      },
      width: "10%",
    },
    {
      title: "User Branch",
      render: (text,record) => {
        const branch_name = customeruser && customeruser.customerBranches &&customeruser.customerBranches.length > 0 && customeruser.customerBranches[0].branch_name ? customeruser.customerBranches[0].branch_name : 'null'
        return (branch_name)
      },
      width: "20%",
    },
    {
      title: "Operating City",
      render: (text,record) => {
        const city = customeruser && customeruser.customerBranches &&customeruser.customerBranches.length > 0 && customeruser.customerBranches[0].city && customeruser.customerBranches[0].city.name  ? customeruser.customerBranches[0].city.name : 'null'
        return (city)
      },
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
      dataSource={customeruser.customer_users}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      loading={loading}
    />
  );
};

export default Users;
