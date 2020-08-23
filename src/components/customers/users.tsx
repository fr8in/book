import { Table, Button, Switch } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import get from 'lodash/get'
//import userData from '../../../mock/customer/users'

const Users = (props) => {
  const { customeruser, loading } = props;
  console.log("customerUser", customeruser);

  var _customeruser= [];
  if (!loading) {
    _customeruser= customeruser
  }
  
  const name = get(_customeruser,'customeruser.name',[])
  console.log('name',name)
  const mobile = get(_customeruser,'customeruser.mobile',[])
  console.log('mobile',mobile)
  const email = get(_customeruser,'customer_users.email',[])
  console.log('email',email)

  const addUser = [
    {
      title: "Name",
      dataIndex: 'name',
      render: (text,record) => { 
         return (name)
      },
      width: "15%",
    },

    {
      title: "Mobile No",
      render: (text,record) => {
           return (mobile)
      },
      width: "20%",
    },

    {
      title: "Email",
      render: (text,record) => {
         return (email)
      },
      width: "10%",
    },
    {
      title: "User Branch",
      render: (text,record) => {
        const branch_name = customeruser[0] && customeruser[0].customerBranches &&customeruser[0].customerBranches.branch_name 
        return (branch_name)
      },
      width: "20%",
    },
    {
      title: "Operating City",
      render: (text,record) => {
        const city = customeruser[0] && customeruser[0].customerBranches  && customeruser[0].customerBranches[0].city && customeruser.customerBranches[0].city.name  
        return (city)
      },
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
      dataSource={customeruser}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      loading={loading}
    />
  );
};

export default Users;
