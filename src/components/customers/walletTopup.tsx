import { Modal,Row,Col,Button, Space,Input, Table } from 'antd'
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
      key:'referenceNo',
      sorter: (a, b) => (a.referenceNo > b.referenceNo ? 1 : -1),
      width: '20%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key:'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
      width: '20%'
    },
    {
      title: 'Payment Details',
      dataIndex: 'paymentDetails',
      key:'paymentDetails',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key:'amount',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      width: '20%'
    },
    ]

  return (
    <Modal
      title={
        <div>
        <Row>
          <Col span={8}>Top Up to Wallet</Col>
        </Row>
      <Row><Input placeholder="Search..." /></Row>
      </div>
    }
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={700}
      footer={<Row justify='start' className='m5'>
      <Col span={5}>Total Amount:77200 </Col>
      <Col span={8} offset={14}>
      <Button type="primary" >Back </Button> <Space>
      <Button type="primary" disabled > Top Up </Button></Space>
      </Col>
      </Row>}
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
