import { Table } from 'antd'

const Branch = () => {
  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'branchName'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Building Number',
      dataIndex: 'buildingNumber'
    },
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'City',
      dataIndex: 'city'
    },
    {
      title: 'State',
      dataIndex: 'state'
    },
    {
      title: 'Pin',
      dataIndex: 'pin'
    },
    {
      title: 'Contact No',
      dataIndex: 'contactNo'
    }
  ]

  return (
    <Table
      columns={column}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Branch
