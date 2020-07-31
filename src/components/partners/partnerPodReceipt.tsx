import {Modal,Input,Button,Form,Row,Col} from 'antd'

const PartnerPod = (props) => {
    const { visible, onHide} = props


  return (
    <Modal
      title='Partner Pod Receipt'
      visible={visible}
      onCancel={onHide}
      width={780}
      bodyStyle={{ padding: 10 }}
      
    >
      <Row gutter={10}>
          <Col xs={8}>
            <Form.Item label>
              <Input
                placeholder='Internal'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label>
              <Input
                placeholder='contact'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={4}>
            <Form.Item label>
            <Button type='primary'>Submit</Button>
            </Form.Item>
          </Col>
        </Row>
        </Modal>
  )
}
export default PartnerPod

