import { Card, Table, Button } from 'antd'
import moment from 'moment'
import IncomingPaymentData from '../../../mock/customer/incomingdata'
import Truncate from '../common/truncate'

const PaymentTraceability = () => {
  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    width: '15%',
    render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
  },
  {
    title: 'Amount',
    dataIndex: 'recevied',
    width: '15%'
  },
  {
    title: 'Booked',
    dataIndex: 'booked',
    width: '15%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '15%'
  },
  {
    title: 'Book Now',
    dataIndex: 'bookNow',
    width: '15%'
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    width: '15%',
    render: (text, record) => <Truncate data={text} length={20} />
  }
  ]

  return (
    <Card
      size='small'
      className='card-body-0 mb10'
      title={`₹${1250}`}
      extra={<Button type='primary' size='small'>Wallet Top-up</Button>}
    >
      <Table
        columns={columns}
        dataSource={IncomingPaymentData}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
      />
    </Card>
  )
}

export default PaymentTraceability
