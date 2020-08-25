import { Table, Button, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, gql } from '@apollo/client'

const DELETE_CUSTOMER_USER_MUTATION = gql`
mutation customerUserDelete($id:Int) {
  delete_customer_user( where: {id: {_eq:$id}}) {
    returning {
      id
      mobile
    }
  }
}
`
const Users = (props) => {
  const { customeruser, loading } = props;
  console.log("customerUser", customeruser);

  const [deleteCustomerUser] = useMutation(
    DELETE_CUSTOMER_USER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onDelete = (id) => {
    deleteCustomerUser({
      variables: {
        id: id
      }
    })
  }


  const addUser = [
    {
      title: "Name",
      dataIndex: 'name',
      render: (text,record) => { 
         return (record.name)
      },
      width: "15%",
    },

    {
      title: "Mobile No",
      render: (text,record) => {
           return (record.mobile)
      },
      width: "20%",
    },

    {
      title: "Email",
      render: (text,record) => {
         return (record.email)
      },
      width: "10%",
    },
    {
      title: "User Branch",
      render: (text,record) => {
        const branch_name = customeruser[0] && customeruser[0].customerBranches &&customeruser[0].customerBranches.branch_name 
        return (record.branch_name)
      },
      width: "20%",
    },
    {
      title: "Operating City",
      render: (text,record) => {
        const city = customeruser[0] && customeruser[0].customerBranches  && customeruser[0].customerBranches[0].city && customeruser.customerBranches[0].city.name  
        return (record.city)
      },
      width: "10%",
    },
    {
      title: "Action",
      render: (text, record) => (
        <span className="actions">
          <Button type="link" icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
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
