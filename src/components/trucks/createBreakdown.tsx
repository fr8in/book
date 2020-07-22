import { Modal, Button, Row, Col, DatePicker, Select, Input, Form, Radio } from 'antd'

const { Option } = Select
const { TextArea } = Input

const CreateBreakdown = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (
    <Modal
      title={props.title}
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button key='back' onClick={onHide}>Close</Button>,
        <Button type='primary' key='submit' onClick={onSubmit}>Save</Button>
      ]}
    >
      <Form layout='vertical'>
        {props.radioType &&
          <Row>
            <Form.Item>
              <Radio.Group>
                <Radio value={1}>Breakdown</Radio>
                <Radio value={0}>In-transit haulting</Radio>
              </Radio.Group>
            </Form.Item>
          </Row>}
        <Row gutter={10}>
          <Col xs={12}>
            <Form.Item label='Available Date'>
              <DatePicker
                showTime
                name='selectSearchDate'
                format='YYYY-MM-DD'
                placeholder='Select Date'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label='Current City'>
              <Select defaultValue='Chennai' onChange={handleChange}>
                <Option value='Coimbatore'>Coimbatore</Option>
                <Option value='Madurai'>Madurai</Option>
                <Option value='Trichy'>Trichy</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <TextArea
              placeholder='Enter Comment'
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateBreakdown
