import { Table } from 'antd'
import branchData from '../../../mock/customer/branch'

const Branch = () => {
  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      width: '20%'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '10%'
    },
    {
      title: 'Building Number',
      dataIndex: 'buildingNo',
      width: '10%'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '20%'
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '10%'
    },
    {
      title: 'State',
      dataIndex: 'state',
      width: '10%'
    },
    {
      title: 'Pin',
      dataIndex: 'pin',
      width: '10%'
    },
    {
      title: 'Contact No',
      dataIndex: 'contactNo',
      width: '10%'
    }
  ]

  return (
    <Table
      columns={column}
      dataSource={branchData}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Branch
