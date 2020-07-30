
import { Row, Col, Card, Tag, Table } from 'antd'
import { totalPending, paymentBlock } from '../../../mock/customer/pendingPayments'

const PendingPayments = () => {
  const PaymentBlockIndicator = (
    <div className='text-right'>
      <Tag color={paymentBlock.paymentBlock ? '#dc3545' : '#28a745'}>{paymentBlock.paymentBlock ? 'Yes' : 'No'}</Tag>
    </div>
  )

  const pendingPaymentColumn = [
    {
      title: 'Total',
      dataIndex: 'pendingType',
      width: '60%'
    },
    {
      dataIndex: 'value',
      width: '40%',
      className: 'text-right'
    }
  ]
  const PaymentBlockColumn = [
    {
      title: 'Payment Block',
      dataIndex: 'pendingType',
      width: '60%'
    },
    {
      title: PaymentBlockIndicator,
      dataIndex: 'value',
      width: '40%',
      className: 'text-right'
    }
  ]

  return (
    <Row gutter={10}>
      <Col xs={24} sm={12}>
        <Card size='small' className='card-body-0'>
          <Table
            columns={pendingPaymentColumn}
            dataSource={totalPending}
            rowKey={(record) => record.id}
            size='small'
            pagination={false}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card size='small' className='card-body-0'>
          <Table
            columns={PaymentBlockColumn}
            dataSource={paymentBlock.pending}
            rowKey={(record) => record.id}
            size='small'
            pagination={false}
          />
        </Card>
      </Col>
    </Row>

  )
}

export default PendingPayments
