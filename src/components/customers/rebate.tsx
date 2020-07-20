import { Modal,Row,Button,Form,Table,Input,Col } from 'antd'
import IncomingPaymentData from '../../../mock/customer/incomingdata'

const Rebate = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    key:'date',
    width: '15%'
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key:'amount',
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
    width: '15%'
  }
]

  return (
    <Modal
      title='Wallet Balance : 1250'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={900}
      footer={<Button type="primary">Transfer </Button>}
    >
      <Row justify='start' className='m5'>
      <Col span={8}>Wallet Balance: 1250</Col>
      <Col span={8} offset={20}>
      <Button type="primary" >Wallet Top-up</Button>
      </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={IncomingPaymentData}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
           />
           <br></br>
           <Form layout='vertical'>
        <Row gutter={10}>
              <Col xs={15}>
                <Form.Item label='Comment'>
                  <Input
                  placeholder='Comment'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              </Row> 
              </Form>
     </Modal>
    
  )
}

export default Rebate
