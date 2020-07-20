import { Modal,Row,Button,Table,Form,Col,Input,Radio,Card } from 'antd'

const Transfer = (props) => {
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
    <Card size='small' className='mt10'>
      <Row>
        <Col xs={60}>
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
              <Col xs={8}>
                <Form.Item label='Account Name'>
                  <Input
                  placeholder='Account Name'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Account Number'>
                  <Input
                  placeholder='Select Time'
                      style={{ width: '100%' }}
                      disabled={false}
                    />  
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Confirm Account Number'>
                   <Input
                      placeholder='Confirm Account Number'
                      style={{ width: '100%' }}
                      disabled={false}
                    />
                </Form.Item>
              </Col>
            </Row>  
            <Row gutter={10}>
              <Col xs={8}>
                <Form.Item label='IFSC Code'>
                  <Input
                  placeholder='IFSC Code'
                  style={{ width: '100%' }}
                  disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Amount'>
                  <Input
                  placeholder='Amount'
                      style={{ width: '100%' }}
                      disabled={false}
                    />  
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='loadId'>
                   <Input
                      placeholder='loadId'
                      style={{ width: '100%' }}
                      disabled={false}
                    />
                </Form.Item>
              </Col>
            </Row> 
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
            <Row justify='start' className='m5'>
            <Radio defaultChecked={false}>Include Mamul</Radio>
            <Radio>Include Special Mamul(System Mamul won't be reduced)</Radio>
          <Button type="primary">Transfer </Button>
          </Row>
    </Modal>
    </Col>
    </Row>
    </Card>
  )
}

export default Transfer
