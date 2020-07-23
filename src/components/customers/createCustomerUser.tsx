
import { Row, Col, Modal, Button, Input, Select, Form } from 'antd'
import { UserBranch, OperatingCities } from '../../../mock/customer/createCustomerUserMock'

const CreateCustomerUser = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  function handleChange (value) {
    console.log(`selected ${value}`)
  }
  return (
    <Modal
      title='Add User'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      style={{ top: 20 }}
      footer={[
        <Button key='back' onClick={onHide}>Cancel</Button>,
        <Button type='primary' key='submit'>Save</Button>
      ]}
    >
      <Row>
        <Col xs={24}>
          <Form layout='vertical'>
            <Form.Item>
              <Input placeholder='Name' />
            </Form.Item>
            <Form.Item>
              <Input placeholder='Mobile No' />
            </Form.Item>
            <Form.Item>
              <Input placeholder='E-Mail' />
            </Form.Item>
            <Row gutter={6}>
              <Col xs={12}>
                <Form.Item>
                  <Select defaultValue='User Branch' onChange={handleChange} options={UserBranch} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item>
                  <Select defaultValue='Enter Operating Cities' onChange={handleChange} options={OperatingCities} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateCustomerUser
