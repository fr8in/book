import { Modal, Row, Col, Button, Space, Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import IncomingPaymentData from '../../../mock/customer/incomingdata'

const WalletTopup = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const columns = [
    {
      title: 'Reference No',
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      sorter: (a, b) => (a.referenceNo > b.referenceNo ? 1 : -1),
      width: '25%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
      width: '15%'
    },
    {
      title: 'Payment Details',
      dataIndex: 'paymentDetails',
      key: 'paymentDetails',
      width: '42%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      width: '18%'
    }
  ]

  const footerData = (
    <Row>
      <Col flex='auto' className='text-left'>
        <span>Total Amount: <b>₹{77200}</b></span>
      </Col>
      <Col flex='200px'>
        <Space>
          <Button onClick={onHide}>Close</Button>
          <Button type='primary'> Top Up </Button>
        </Space>
      </Col>
    </Row>)

  return (
    <Modal
      title={
        <div>
          <Row>
            <Col span={8} className='mb5'>Top Up to Wallet</Col>
          </Row>
          <Row><Input placeholder='Search...' suffix={<SearchOutlined />} /></Row>
        </div>
      }
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 10 }}
      style={{ top: 20 }}
      footer={footerData}
    >
      <Table
        columns={columns}
        dataSource={IncomingPaymentData}
        rowKey={(record) => record.id}
        size='small'
        pagination={false}
      />
    </Modal>
  )
}

export default WalletTopup
