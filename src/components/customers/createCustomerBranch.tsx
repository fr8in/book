
import { Row, Col, Modal, Button, Input, Select, Form } from 'antd'
import { City, State } from '../../../mock/customer/createCustomerBranchMock'

const CreateCustomerBranch = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (
    <>
      <Modal
        title='Add/Edit Branch'
        style={{ top: 20 }}
        visible={visible}
        onOk={onSubmit}
        onCancel={onHide}
        footer={[
          <Button key='back' onClick={onHide}>Cancel</Button>,
          <Button type='primary' key='submit'>Save</Button>
        ]}
      >
        <Row>
          <Col xs={24}>
            <Form layout='vertical'>
              <Form.Item>
                <Input placeholder='Branch Name' />
              </Form.Item>
              <Form.Item>
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item>
                <Input placeholder='Building Number' />
              </Form.Item>
              <Form.Item>
                <Input placeholder='Address' />
              </Form.Item>
              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item
                    label='City'
                    name='City'
                    rules={[{ required: true, message: 'City is required field' }]}
                  >
                    <Select defaultValue='' onChange={handleChange} options={City} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label='State'
                    name='State'
                    rules={[{ required: true, message: 'State is required field' }]}
                  >
                    <Select defaultValue='' onChange={handleChange} options={State} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item>
                    <Input placeholder='Pin Code' />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item>
                    <Input placeholder='Contact Number' />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default CreateCustomerBranch
