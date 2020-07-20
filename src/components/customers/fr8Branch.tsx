import { Table } from 'antd'
import branchData from '../../../mock/customer/branch'

const Fr8Branch = () => {
  const fr8Branch = [
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      width: '35%'
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      width: '35%'
    },
    {
      title: 'Traffic',
      dataIndex: 'traffic',
      width: '30%'
    }
  ]

  return (
    <Table
      columns={fr8Branch}
      dataSource={branchData}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Fr8Branch
