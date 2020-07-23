import { Table } from 'antd'
import finalPayment from '../../../mock/customer/finalPayment'

const statusList = [
  { value: 1, text: 'Advance is Pending' },
  { value: 11, text: 'Received Amount< Customer Advance %' }
]

const AdvancePending = () => {
  const advancePending = [
    {
      title: 'Load Id',
      dataIndex: 'loadId',
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Order',
      dataIndex: 'order',
      sorter: (a, b) => (a.order > b.order ? 1 : -1),
      width: '5%'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      sorter: (a, b) => (a.truckNo > b.truckNo ? 1 : -1),
      width: '7%'
    },
    {
      title: 'Source',
      dataIndex: 'source',
      width: '7%'
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      width: '10%'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '10%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusList,
      width: '12%'
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      sorter: (a, b) => (a.userName > b.userName ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Customer Price',
      dataIndex: 'price',
      sorter: (a, b) => (a.price > b.price ? 1 : -1),
      width: '11%'
    },
    {
      title: 'Received',
      dataIndex: 'received',
      sorter: (a, b) => (a.received > b.received ? 1 : -1),
      width: '5%'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '5%'
    },
    {
      title: 'Aging',
      dataIndex: 'aging',
      sorter: (a, b) => (a.aging > b.aging ? 1 : -1),
      width: '5%'
    }
  ]

  return (
    <Table
      columns={advancePending}
      dataSource={finalPayment}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default AdvancePending
