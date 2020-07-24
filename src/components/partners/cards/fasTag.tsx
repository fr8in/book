import { Table } from 'antd'

const PartnerFasTag = () => {
  const columnsCurrent = [
    {
      title: 'Tag Id',
      dataIndex: 'id'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'ST Code',
      dataIndex: 'stCode'
    },
    {
      title: 'Partner',
      dataIndex: 'partner'
    }]
  return (
    <Table
      columns={columnsCurrent}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default PartnerFasTag
