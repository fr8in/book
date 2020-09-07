import { Modal, Row, Button, Form, Col, Input, Radio } from 'antd'
import PaymentTraceability from './paymentTraceability'

const Transfer = (props) => {
  const { visible, onHide ,cardcode,wallet_balance} = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }
  const footerData = (
    <Row>
      <Col flex='auto' className='text-left'>
        <Radio defaultChecked={false}>Include Mamul</Radio>
        <Radio>Include Special Mamul(System Mamul won't be reduced)</Radio>
      </Col>
      <Col flex='90px'>
        <Button type='primary'>Transfer </Button>
      </Col>
    </Row>)

  return (

    <Modal
      title={wallet_balance}
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 10 }}
      style={{ top: 20 }}
      footer={footerData}
    >
      <Row className='mb10'>
        <Col xs={24}>
          <PaymentTraceability cardcode={cardcode} wallet_balance={wallet_balance}/>
        </Col>
      </Row>
      <Form layout='vertical'>
        <Row gutter={10}>
          <Col xs={8}>
            <Form.Item label='Account Name'>
              <Input
                placeholder='Account Name'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item label='Account Number'>
              <Input
                placeholder='Select Time'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item label='Confirm Account Number'>
              <Input
                placeholder='Confirm Account Number'
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
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item label='Amount'>
              <Input
                placeholder='Amount'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item label='loadId'>
              <Input
                placeholder='loadId'
                disabled={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item label='Comment'>
              <Input.TextArea
                placeholder='Comment'
                disabled={false}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default Transfer
