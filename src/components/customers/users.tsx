import { Table } from 'antd'
import userData from '../../../mock/customer/users'

const Users = () => {
  const addUser = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%'
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo',
      width: '20%'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%'
    },
    {
      title: 'User Branch',
      dataIndex: 'userBranch',
      width: '20%'
    },
    {
      title: 'Operating City',
      dataIndex: 'operatingCity',
      width: '20%'
    }
  ]

  return (
    <Table
      columns={addUser}
      dataSource={userData}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Users
