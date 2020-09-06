import { Modal, Button, Row, Col, Form, Input, Table } from 'antd'

const columnsCurrent = [
  {
    title: 'Date',
    dataIndex: 'date'
  },
  {
    title: 'Amount',
    dataIndex: 'amount'
  },
  {
    title: 'Booked',
    dataIndex: 'booked'
  },
  {
    title: 'Balance',
    dataIndex: 'balance'
  },
  {
    title: 'Book Now',
    dataIndex: 'bookNow'
  },
  {
    title: 'Remark',
    dataIndex: 'remark'
  }
]
const AdvanceBooking = (props) => {
  const { visible, onHide } = props

  return (
    <div>
      <Modal
        title='Advance Booking'
        visible={visible}
        onCancel={onHide}
        width={700}
        footer={[
          <div key='footer'>
            <Row>
              <Col>Total: {0}</Col>
              <Col flex='180'> <Button type='primary'> Book </Button></Col>
            </Row>
            <Row>Advance: {6000}, (Recievables: {54500},Charge: {1500})</Row>
          </div>
        ]}
      >
        <div>
          <Row justify='start' className='m5'>
            <Col span={8}><h3> Wallet Balance: 0 </h3></Col>
            <Col span={5} offset={11}>
              <Button type='primary'>Wallet Top-up</Button>
            </Col>
          </Row>
          <Table
            columns={columnsCurrent}
            rowKey={record => record.id}
            size='small'
            scroll={{ x: 600, y: 400 }}
            pagination={false}
          />
          <br />
          <Form layout='vertical'>
            <Row gutter={10}>
              <Col sm={15}>
                <Form.Item
                  label='Cash'
                >
                  <Input
                    placeholder='Amount'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default AdvanceBooking
