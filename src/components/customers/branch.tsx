import { Table, Button } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import branchData from '../../../mock/customer/branch'

const Branch = () => {
  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      width: '15%'
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
      width: '15%'
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
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Button type='link' icon={<DeleteOutlined />} />
          <Button type='link' icon={<EditOutlined />} />
        </span>
      ),
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
      className='withAction'
    />
  )
}

export default Branch
