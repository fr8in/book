import IncomingPaymentData from '../../../mock/customer/incomingdata'
import { Table } from 'antd'
import IncomingPaymentsBooked from './incomingPaymentsBooked'

const IncomingPayments = (props) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%'
    },
    {
      title: 'Booked',
      dataIndex: 'booked',
      key: 'booked',
      width: '20%'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: '20%'
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '20%'
    }
  ]
  return (
    <Table
      columns={columns}
      expandedRowRender={record => <IncomingPaymentsBooked {...record} />}
      dataSource={IncomingPaymentData}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />

  )
}
export default IncomingPayments
