
import { Table } from 'antd'
import finalPayment from '../../../mock/customer/finalPayment'

const FinalPaymentsPending = () => {
  const finalPaymentsPending = [
    {
      title: 'LoadId',
      dataIndex: 'loadId',
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      sorter: (a, b) => (a.itemName > b.itemName ? 1 : -1),
      width: '24%'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      sorter: (a, b) => (a.truckN0 > b.truckNo ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '15%'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      sorter: (a, b) => (a.customerName > b.customerName ? 1 : -1),
      width: '15%'
    },
    {
      title: 'SO Price',
      dataIndex: 'soPrice',
      sorter: (a, b) => (a.soPrice > b.soPrice ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Aging',
      dataIndex: 'aging',
      sorter: (a, b) => (a.aging > b.aging ? 1 : -1),
      width: '10%'
    }
  ]

  return (
    <Table
      columns={finalPaymentsPending}
      dataSource={finalPayment}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default FinalPaymentsPending
