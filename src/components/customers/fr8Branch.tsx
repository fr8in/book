import { Table } from 'antd'

const Fr8Branch = () => {
  const fr8Branch = [
    {
      title: 'Branch Name',
      dataIndex: 'branchName'
    },
    {
      title: 'Orders',
      dataIndex: 'orders'
    },
    {
      title: 'Traffic',
      dataIndex: 'traffic'
    }
  ]

  return (
    <Table
      columns={fr8Branch}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Fr8Branch
