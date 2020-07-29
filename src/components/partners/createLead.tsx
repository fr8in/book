
import { Modal, Button, Input, Row, Col, Form, Select } from 'antd'
import { OwnerName, SelectType } from '../../../mock/sourcing/createLead'

const { TextArea } = Input
const { Option } = Select

const CreateLead = (props) => {
  function handleChange (value) {
    console.log(`selected ${value}`)
  }
  const onChange = e => {
    console.log(e)
  }
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }
  return (
    <Modal
      title='Create Lead'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button type='primary' key='back'> Submit </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item>
          <Input placeholder='Company Name' />
        </Form.Item>
        <Form.Item>
          <Input placeholder=' Name' />
        </Form.Item>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item>
              <Input placeholder='Phone' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item>
              <Select defaultValue='' allowClear>
                <Option value=' '> </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item>
              <Select defaultValue='Select Source' onChange={handleChange} options={SelectType} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item>
              <Select defaultValue='Select Owner' onChange={handleChange} options={OwnerName} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <TextArea placeholder='Comment' allowClear onChange={onChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateLead
