import { Modal,Row,Col,Button, Space,Tooltip,Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

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
      sorter: (a, b) => (a.referenceNo > b.referenceNo ? 1 : -1),
      width: '20%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
      width: '20%'
    },
    {
      title: 'Payment Details',
      dataIndex: 'paymentDetails',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
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
          <Col span={8} offset={24}>
          <SearchOutlined />
          </Col>
        </Row>
      <Row><Input placeholder="Search..." /></Row>
      </div>
    }
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        size='small'
        pagination={false}
      />
      <br></br>
      <Row justify='start' className='m5'>
      <Col span={8}>Total Amount: </Col>
      <Col span={8} offset={8}>
      <Button type="primary" >Back </Button> <Space>
      <Button type="primary" disabled > Top Up </Button></Space>
      </Col>
      </Row>
      
    </Modal>
  )
}

export default WalletTopup
