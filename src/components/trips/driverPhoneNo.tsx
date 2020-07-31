import { Row, Col, Tooltip, Form, Input, Space, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const phoneNumber = () => {
  return (
    <Row gutter={10}>
      <Col flex='auto'>
        <Form.Item label='Driver Phone'>
          <Tooltip
            trigger={['hover']}
            title='Enter 10 digit mobile number starting with 6 to 9'
            placement='top'
            overlayClassName='numeric-input'
          >
            <Input
              id='driverNumber'
              placeholder='Enter Driver Number'
              maxLength={10}
              disabled={false}
            />
          </Tooltip>
        </Form.Item>
      </Col>
      <Col flex='36px'>
        <Form.Item label>
          <Space>
            <Button type='primary' shape='circle' icon={<SaveOutlined />} />
          </Space>
        </Form.Item>
      </Col>
    </Row>
  )
}
export default phoneNumber
