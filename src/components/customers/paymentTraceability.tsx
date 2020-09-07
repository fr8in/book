import { Card, Table, Button, Input } from 'antd'
import moment from 'moment'
import IncomingPaymentData from '../../../mock/customer/incomingdata'
import Truncate from '../common/truncate'

const PaymentTraceability = (props) => {
  const { selectedRowKeys, selectOnchange } = props
  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    width: '15%',
    render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
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
    width: '15%',
    render: (text, record) => {
      return (
        // selectedRow && selectedRow.length > 0 && selectedRow.find(data => data.key === record.key)
        <Input />
      )
    }
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
        rowSelection={{
          selectedRowKeys,
          onChange: selectOnchange,
          type: 'radio'
        }}
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
