import { Modal, Row, Button, Form, Input, Col } from 'antd'
import PaymentTraceability from './paymentTraceability'

const Rebate = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  return (
    <Modal
      title='Wallet Balance : 1250'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 10 }}
      style={{ top: 20 }}
      footer={<Button type='primary'>Transfer </Button>}
    >
      <Row className='mb10'>
        <Col xs={24}>
          <PaymentTraceability />
        </Col>
      </Row>
      <Form layout='vertical'>
        <Row>
          <Col xs={24}>
            <Form.Item label='Comment'>
              <Input.TextArea
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
