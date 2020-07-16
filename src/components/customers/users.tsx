import { Table } from 'antd'

const Users = () => {
  const addUser = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'User Branch',
      dataIndex: 'userBranch'
    },
    {
      title: 'Operating City',
      dataIndex: 'operatingCity'
    }
  ]

  return (
    <Table
      columns={addUser}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Users
