import { Table, Row, Col, Button } from 'antd'
import customerPending from '../../../mock/trip/payment'
import EditModal from './AdvanceBookingEdit'
import useShowHide from '../../hooks/useShowHide'

const CustomerPayments = () => {
  const initial = { edit: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const advancePaymentColumns = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => 'Advance',
    width: '20%'
  },
  {
    title: 'Doc No',
    dataIndex: 'docEntry',
    width: '20%'
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    width: '20%'
  },
  {
    title: 'Received',
    dataIndex: 'recevied',
    render: (text, record) => {
      return text || 0
    },
    width: '20%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    render: (text, record) => (
      <span>
        <Button type='primary' onClick={() => onShow('edit')}>
          Edit
        </Button>
      </span>
    )
  }]

  const invoicePendingColumns = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => 'Invoice Pending',
    width: '20%'
  },

  {
    title: 'Amount',
    dataIndex: 'amount',
    width: '20%'
  },
  {
    title: 'Received',
    dataIndex: 'recevied',
    render: (text, record) => {
      return text || 0
    },
    width: '20%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    render: (text, record) => (
      <span>
        <Button type='primary' onClick={() => onShow('edit')}>
          Edit
        </Button>

      </span>
    )

  }

  ]

  const finalPaymentColumns = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => 'Invoiced',
    width: '19%'
  },
  {
    title: 'Doc No',
    dataIndex: 'docEntry',
    render: (text, record) => {
      return text || 0
    },
    width: '18%'
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (text, record) => {
      return (record.received ? record.received : 0) + (record.balance ? record.balance : 0)
    },
    width: '18%'
  },
  {
    title: 'Received',
    dataIndex: 'received',
    render: (text, record) => {
      return text || 0
    },
    width: '16%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    render: (text, record) => {
      return text || 0
    },
    width: '16%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    key: 'edit',
    render: (text, record) => (
      <span>
        <Button type='primary' onClick={() => onShow('edit')}>
          Edit
        </Button>
      </span>
    ),
    width: '4%'
  }
  ]
  return (
    <>
      <div>
        <Row className='payableHead' gutter={6}>
          <Col xs={24}><b>Advance Payments</b></Col>
        </Row>
        <Table
          columns={advancePaymentColumns}
          dataSource={customerPending}
          pagination={false}
          rowKey={record => record.id}
          scroll={{ x: 540 }}
          size='small'
        />
      </div>
      <div>
        <Row className='payableHead' gutter={6}>
          <Col xs={24}><b>Invoice Pending Payments</b></Col>
        </Row>
        <Table
          columns={invoicePendingColumns}
          dataSource={customerPending}
          rowKey={record => record.id}
          scroll={{ x: 540 }}
          pagination={false}
          size='small'
        />
      </div>
      <div>
        <Row className='payableHead' gutter={6}>
          <Col xs={24}><b>Pending Payments</b></Col>
        </Row>
        <Table
          columns={finalPaymentColumns}
          dataSource={customerPending}
          rowKey={record => record.id}
          scroll={{ x: 540 }}
          pagination={false}
          size='small'
        />
      </div>
      <div className='payableHead'>
        <h4 className='text-center'>100% payment received from customer</h4>
      </div>
      {visible.edit && <EditModal visible={visible.edit} onHide={onHide} />}
    </>
  )
}

export default CustomerPayments
