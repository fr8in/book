import {Modal,Input,Button,Form,Row,Col,Select} from 'antd'

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
          <Form.Item >
             <Select
                   
             />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form>
              <Input
                placeholder='contact'
                disabled={false}
              />
            </Form>
          </Col>
          <Col xs={4}>
            <Form>
            <Button type='primary'>Submit</Button>
            </Form>
          </Col>
        </Row>
        </Modal>
  )
}
export default PartnerPod

