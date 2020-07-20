import { Modal,Row,Button,Form,Table,Input,Col } from 'antd'

const Rebate = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    width: '15%'
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
    width: '15%'
  }
]

  return (
    <Modal
      title='Wallet Balance : 1250'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Row justify='start' className='m5'>
      <Col span={8}>Wallet Balance: 1250</Col>
      <Col span={8} offset={8}>
      <Button type="primary" >Wallet Top-up</Button>
      </Col>
      </Row>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
           />
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
        <Row justify='end' className='m5'>
          <Button type="primary">Transfer </Button>
          </Row>

    </Modal>
    
  )
}

export default Rebate
