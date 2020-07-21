import { Table, Row, Col, Button } from 'antd'
import invoicePending from '../../../mock/trip/payment'
import EditModal from '../../components/trips/editModal'
import useShowHide from '../../hooks/useShowHide'
const CustomerPayments = () => {
  const initial = { edit:false}
  const { visible, onShow,onHide } = useShowHide(initial)
  const advancePaymentColumns = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => 'Advance',
    width: '20%'
  },
  {
    title: 'Doc No',
    dataIndex: 'base_Advance_DocEntry',
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
    dataIndex: 'pending',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    render: (text, record) => (
      <span>
        <Button type='primary'>
          edit
        </Button>
      </span>
    )
  }]

  const invoicePendigColumns = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => 'Invoice Pending',
    width: '20%'
  },

  {
    title: 'Amount',
    dataIndex: 'price',
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
    dataIndex: 'invoicePending',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    render: (text, record) => (
      <span>
        <Button type='primary' onClick={() => onShow('edit')} >
          Edit
        </Button>
        {visible.edit && <EditModal  visible={visible.edit} onHide={() => onHide('edit')} />}
      </span>
    )
  }]

  const finalPaymentColumns = [{
    title: 'Type',
    dataIndex: 'invoiceType',
    width: '19%'
  },
  {
    title: 'Doc No',
    dataIndex: 'docentry',
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
        <Button type='primary'>
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
          //   dataSource={props.advancePendingPaymentArray}
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
          columns={invoicePendigColumns}
          dataSource={invoicePending}
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
          //   dataSource={props.balancePendingPayment}
          rowKey={record => record.id}
          scroll={{ x: 540 }}
          pagination={false}
          size='small'
        />
      </div>
      <div className='payableHead'>
        <h4 className='text-center'>100% payment received from customer</h4>
      </div>
    </>
  )
}

export default CustomerPayments
